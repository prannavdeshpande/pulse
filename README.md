# ⚡ Pulse — Open-Source API Reliability & Incident Management Platform

**Pulse** is a 100% open-source, enterprise-grade API reliability and automated incident management platform designed for microservices, cloud APIs, and distributed systems.

---

## 🌟 Key Features

- **Synthetic API Monitoring**: Automated periodic HTTP/REST/gRPC endpoint health checks.
- **Workflow Orchestration**: Powered by **Temporal** for resilient, stateful retries and workflow execution.
- **Local AI Root Cause Analysis**: Integrated with **Ollama** and **LangChainGo** for automated incident post-mortems without leaking sensitive data to external AI providers.
- **Multi-Tenant Team Scoping & Auth**: Secure JWT-based access control with organization/team level data isolation.
- **Local Infra Included**: Battery-included Docker Compose setup for Mongo 7.0, Redis 7.0, Temporal, Mailpit, and Ollama.

---

## 🏗️ Architecture & Monorepo Structure

```text
pulse/
├── .github/workflows/ci.yml # GitHub Actions CI pipeline
├── apps/
│   ├── web/                 # Next.js 14 App Router (TypeScript + Tailwind CSS)
│   └── backend/             # Go 1.22+ API server & Temporal Worker
│       ├── cmd/
│       │   ├── api/         # Gin REST API entrypoint
│       │   └── worker/      # Temporal worker process
│       └── internal/
│           ├── config/      # Environment & app config loader
│           ├── middleware/  # Auth (JWT/Team Scope) & CORS middleware
│           ├── domain/      # Domain structs & business interfaces
│           ├── repository/  # MongoDB & Redis persistence implementations
│           └── temporal/    # Workflow definitions & synthetic ping activities
├── docker-compose.yml       # Local developer dependencies
├── Makefile                 # Developer quick commands
├── LICENSE                  # MIT License
├── .env.example             # Baseline environment template
└── README.md
```

---

## 🚀 Quickstart Guide

### Prerequisites

- **Docker & Docker Compose** (version 20+)
- **Go 1.22+**
- **Node.js 18+** & **npm**

### 1. Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```

### 2. Start Local Infrastructure Stack
Spin up MongoDB, Redis, Temporal, Ollama, and Mailpit:
```bash
make infra-up
```

Service dashboards available once containers are running:
- **Temporal Web UI**: [http://localhost:8233](http://localhost:8233)
- **Mailpit Email Dashboard**: [http://localhost:8025](http://localhost:8025)
- **Ollama LLM Engine**: [http://localhost:11434](http://localhost:11434)
- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`

### 3. Run Backend Services
Start the REST API server:
```bash
make backend-api
```

In a second terminal, start the Temporal worker:
```bash
make backend-worker
```

### 4. Run Web Dashboard
In another terminal:
```bash
make web-dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run tests across all monorepo components:
```bash
make test
```

Build production artifacts:
```bash
make build
```

---

## 📄 License
Released under the [MIT License](LICENSE).
