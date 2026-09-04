.PHONY: help infra-up infra-down backend-api backend-worker web-dev build clean test

help:
	@echo "Pulse Monorepo Commands:"
	@echo "  make infra-up        Start all Docker dependencies (Mongo, Redis, Temporal, Ollama, Mailpit)"
	@echo "  make infra-down      Stop and clean Docker containers"
	@echo "  make backend-api     Run Go API server locally"
	@echo "  make backend-worker  Run Go Temporal worker locally"
	@echo "  make web-dev         Start Next.js frontend dev server"
	@echo "  make build           Build both backend Go binaries and frontend Next.js app"
	@echo "  make test            Run backend and frontend tests"

infra-up:
	docker compose up -d

infra-down:
	docker compose down

backend-api:
	cd apps/backend && go run ./cmd/api

backend-worker:
	cd apps/backend && go run ./cmd/worker

web-dev:
	cd apps/web && npm run dev

build:
	cd apps/backend && go build -o bin/api ./cmd/api && go build -o bin/worker ./cmd/worker
	cd apps/web && npm run build

test:
	cd apps/backend && go test ./...
	cd apps/web && npm run test

clean:
	rm -rf apps/backend/bin
	rm -rf apps/web/.next
