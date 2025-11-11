# === Stage 1: Builder ===
# This stage installs all dependencies and builds the entire monorepo.
FROM node:20-alpine AS builder

# Set the working directory to the monorepo root
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm
# Install buf CLI
RUN apk add --no-cache curl && \
    curl -sSL https://github.com/bufbuild/buf/releases/download/v1.59.0/buf-Linux-x86_64 -o /usr/local/bin/buf && \
    chmod +x /usr/local/bin/buf


# Copy the entire monorepo context.
COPY ./server server
COPY ./shared shared
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY pnpm-workspace.yaml pnpm-workspace.yaml
ENV CI=true
# Install all dependencies recursively based on the lockfile.
RUN pnpm install --frozen-lockfile
WORKDIR /app/server
RUN pnpm install --frozen-lockfile
WORKDIR /app

# Build all packages in the entire monorepo.
RUN pnpm -r generate
RUN pnpm -r build

# --- THIS IS THE FIX ---

# This ARG must be passed during the 'docker build' command.
# It should be the simple name of your service (e.g., "auth")
ARG SERVICE_NAME

# 1. Change the working directory to /app/server
#    This is exactly what you did in your successful test.
WORKDIR /app/server

# 2. Run pnpm deploy from here.
#    pnpm will now use the /app/server/pnpm-workspace.yaml.
#    The filter --filter=${SERVICE_NAME} (e.g., --filter=auth) will now work.
#    The output path /prod is relative, so it will create /app/server/prod.
RUN pnpm deploy --filter=${SERVICE_NAME} --prod ./prod --legacy

# --- END FIX ---


# === Stage 3: Final Image ===
FROM node:20-alpine AS final

# Set working directory
WORKDIR /app

# Set Node.js to production mode
ENV NODE_ENV=production

# Copy the pruned application (code + node_modules)
# from the builder stage into our final image.
#
# vvv THE COPY PATH MUST BE UPDATED vvv
# The files are now at /app/server/prod, not /app/prod
COPY --from=builder /app/server/prod /app/server/prod
RUN npm install -g pnpm
# At this point, /app contains *only* your target service.
WORKDIR /app/server/prod
# This command is still correct (assuming you did Option 1)
CMD ["pnpm", "start"]