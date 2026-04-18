# =============================================================================
# DATACENDIA FRONTEND - PRODUCTION DOCKERFILE
# Multi-stage build for optimized production image
#
# Usage:
#   Basic: docker build -t datacendia:frontend .
#   With build args: docker build --build-arg VITE_API_URL=https://api.example.com/api/v1 -t datacendia:frontend .
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment (optional, defaults to localhost for dev)
ARG VITE_API_URL=http://localhost:3001/api/v1
ARG VITE_WS_URL=ws://localhost:3001
ARG VITE_APP_NAME=Datacendia
ARG VITE_APP_VERSION=1.0.0

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S datacendia && \
    adduser -S datacendia -u 1001

# Copy custom nginx config (fallback to default if not present)
COPY docker/nginx.conf /etc/nginx/nginx.conf 2>/dev/null || echo "# Using default nginx config"

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R datacendia:datacendia /usr/share/nginx/html && \
    chown -R datacendia:datacendia /var/cache/nginx && \
    chown -R datacendia:datacendia /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R datacendia:datacendia /var/run/nginx.pid

# Switch to non-root user
USER datacendia

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
