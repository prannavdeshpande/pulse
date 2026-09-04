package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"pulse/backend/internal/config"
	"pulse/backend/internal/middleware"
	"pulse/backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	log.Printf("Starting Pulse API Server on port :%s (env: %s)", cfg.Port, cfg.Env)

	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	// Public Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()

		mongoStatus := "healthy"
		if mongoRepo, err := repository.NewMongoRepository(ctx, cfg.MongoURI, cfg.MongoDBName); err != nil {
			mongoStatus = "unreachable: " + err.Error()
		} else {
			_ = mongoRepo.Close(ctx)
		}

		redisStatus := "healthy"
		if redisRepo, err := repository.NewRedisRepository(ctx, cfg.RedisAddr, cfg.RedisPassword, cfg.RedisDB); err != nil {
			redisStatus = "unreachable: " + err.Error()
		} else {
			_ = redisRepo.Close()
		}

		c.JSON(http.StatusOK, gin.H{
			"status":      "UP",
			"service":     "pulse-api",
			"environment": cfg.Env,
			"timestamp":   time.Now().Format(time.RFC3339),
			"dependencies": gin.H{
				"mongodb": mongoStatus,
				"redis":   redisStatus,
			},
		})
	})

	// Dev token generator endpoint for local testing
	r.GET("/api/v1/auth/dev-token", func(c *gin.Context) {
		token, err := middleware.GenerateDevToken(cfg.JWTSecret, "user-dev-123", "admin@pulse.internal", "team-alpha")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"token":      token,
			"type":       "Bearer",
			"expires_in": 86400,
			"user_id":    "user-dev-123",
			"team_id":    "team-alpha",
		})
	})

	// Protected API Routes requiring JWT Auth and Team Scope Context
	api := r.Group("/api/v1")
	api.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	api.Use(middleware.RequireTeamScope())
	{
		api.GET("/me", func(c *gin.Context) {
			teamID, _ := middleware.ExtractTeamID(c)
			c.JSON(http.StatusOK, gin.H{
				"user_id":   c.GetString("userID"),
				"email":     c.GetString("userEmail"),
				"role":      c.GetString("userRole"),
				"active_team": teamID,
			})
		})

		api.GET("/incidents", func(c *gin.Context) {
			teamID, _ := middleware.ExtractTeamID(c)
			c.JSON(http.StatusOK, gin.H{
				"team_id":   teamID,
				"incidents": []gin.H{},
				"total":     0,
			})
		})
	}

	serverAddr := ":" + cfg.Port
	if err := r.Run(serverAddr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
