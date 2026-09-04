package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type PulseClaims struct {
	UserID string   `json:"user_id"`
	Email  string   `json:"email"`
	Role   string   `json:"role"`
	TeamID string   `json:"team_id"`
	Teams  []string `json:"teams"`
	jwt.RegisteredClaims
}

// JWTAuthMiddleware verifies JWT access tokens and extracts team scoping information
func JWTAuthMiddleware(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// In development mode, allow unauthenticated access for system health/docs
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "Unauthorized",
				"message": "Authorization header required",
			})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "Unauthorized",
				"message": "Invalid Authorization header format. Expected 'Bearer <token>'",
			})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims := &PulseClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "Unauthorized",
				"message": "Invalid or expired authentication token",
			})
			c.Abort()
			return
		}

		// Team Scoping Logic: Check header override or token claims
		teamIDHeader := c.GetHeader("X-Team-ID")
		effectiveTeamID := claims.TeamID
		if teamIDHeader != "" {
			effectiveTeamID = teamIDHeader
		}

		// Attach identity & multi-tenant team scope to Gin context
		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRole", claims.Role)
		c.Set("teamID", effectiveTeamID)
		c.Set("userTeams", claims.Teams)

		c.Next()
	}
}

// RequireTeamScope ensures that the request is bound to an active team context
func RequireTeamScope() gin.HandlerFunc {
	return func(c *gin.Context) {
		teamID, exists := c.Get("teamID")
		if !exists || teamID == "" {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Forbidden",
				"message": "Target team scope missing in request context",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

// GenerateDevToken creates a sample signed JWT token for developer testing
func GenerateDevToken(secretKey string, userID, email, teamID string) (string, error) {
	claims := PulseClaims{
		UserID: userID,
		Email:  email,
		Role:   "admin",
		TeamID: teamID,
		Teams:  []string{teamID, "default-team"},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}

// ExtractTeamID returns the active team scope from Gin context
func ExtractTeamID(c *gin.Context) (string, error) {
	val, exists := c.Get("teamID")
	if !exists {
		return "", errors.New("team ID not found in context")
	}
	teamID, ok := val.(string)
	if !ok {
		return "", errors.New("team ID context is not a string")
	}
	return teamID, nil
}
