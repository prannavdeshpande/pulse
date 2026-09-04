package config

import (
	"os"
	"strconv"
)

type Config struct {
	Env               string
	Port              string
	JWTSecret         string
	MongoURI          string
	MongoDBName       string
	RedisAddr         string
	RedisPassword     string
	RedisDB           int
	TemporalHostPort  string
	TemporalTaskQueue string
	OllamaBaseURL     string
	OllamaModel       string
}

func LoadConfig() *Config {
	redisDB, _ := strconv.Atoi(getEnv("REDIS_DB", "0"))

	return &Config{
		Env:               getEnv("ENV", "development"),
		Port:              getEnv("PORT", "8080"),
		JWTSecret:         getEnv("API_SECRET_KEY", "pulse_super_secret_jwt_key_2026"),
		MongoURI:          getEnv("MONGO_URI", "mongodb://pulse:pulsepassword@localhost:27017/pulse_db?authSource=admin"),
		MongoDBName:       getEnv("MONGO_DB_NAME", "pulse_db"),
		RedisAddr:         getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPassword:     getEnv("REDIS_PASSWORD", ""),
		RedisDB:           redisDB,
		TemporalHostPort:  getEnv("TEMPORAL_HOST_PORT", "localhost:7233"),
		TemporalTaskQueue: getEnv("TEMPORAL_TASK_QUEUE", "pulse-monitoring-queue"),
		OllamaBaseURL:     getEnv("OLLAMA_BASE_URL", "http://localhost:11434"),
		OllamaModel:       getEnv("OLLAMA_MODEL", "llama3:8b"),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}
