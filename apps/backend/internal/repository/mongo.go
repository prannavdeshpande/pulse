package repository

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MongoRepository struct {
	Client   *mongo.Client
	Database *mongo.Database
}

func NewMongoRepository(ctx context.Context, uri, dbName string) (*MongoRepository, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctxTimeout, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to mongodb: %w", err)
	}

	if err := client.Ping(ctxTimeout, readpref.Primary()); err != nil {
		return nil, fmt.Errorf("failed to ping mongodb: %w", err)
	}

	db := client.Database(dbName)
	return &MongoRepository{
		Client:   client,
		Database: db,
	}, nil
}

func (r *MongoRepository) Ping(ctx context.Context) error {
	return r.Client.Ping(ctx, readpref.Primary())
}

func (r *MongoRepository) Close(ctx context.Context) error {
	return r.Client.Disconnect(ctx)
}
