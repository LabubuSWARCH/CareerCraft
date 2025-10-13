# CareerCraft Server

Services and shared packages that power the CareerCraft backend. The folder is a pnpm workspace containing REST APIs, supporting workers, and generated gRPC clients.

## Structure

- `apps/auth` – authentication service (REST + gRPC)
- `apps/template` – resume template service (REST)
- `pkg/grpc` – protobuf definitions and generated TypeScript clients
- `docker-compose.yaml` – Postgres, Redis, and MongoDB for local development
- `postman/` – preconfigured API collections and environments

Each app has its own README with service-specific details.

## Prerequisites

- Node.js 18+
- pnpm (preferred) or npm
- Docker + Docker Compose (for databases and Redis)

## Install Dependencies

From the repository root (recommended so shared code is hoisted correctly):

```bash
pnpm install
```

## Local Infrastructure

Start the databases and Redis with Docker Compose:

```bash
docker compose up postgres redis mongo
```

Leave this running in a terminal while you work. Connection strings are defined per service (`apps/*/src/config`).

## Development Commands

Run these from `server/` unless noted otherwise.

```bash
pnpm dev           # Start all workspace services with ts-node-dev
pnpm generate      # Run codegen (e.g., buf -> pkg/grpc)
```

To target a specific service, use pnpm filters, e.g.:

```bash
pnpm --filter auth dev
pnpm --filter auth template
pnpm --filter template seed   # Load JSON templates into MongoDB
pnpm --filter grpc generate   # Regenerate gRPC client code
```

## Environment Variables

Create `.env` files in each app directory (`apps/auth`, `apps/template`) to override defaults in their respective `src/config` modules.
