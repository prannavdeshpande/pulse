package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisRepository struct {
	Client *redis.Client
}

func NewRedisRepository(ctx context.Context, addr, password string, db int) (*RedisRepository, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})

	ctxTimeout, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := rdb.Ping(ctxTimeout).Err(); err != nil {
		return nil, fmt.Errorf("failed to ping redis at %s: %w", addr, err)
	}

	return &RedisRepository{
		Client: rdb,
	}, nil
}

func (r *RedisRepository) Ping(ctx context.Context) error {
	return r.Client.Ping(ctx).Err()
}

func (r *RedisRepository) Close() error {
	return r.Client.Close()
}
