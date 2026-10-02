# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Native modules (better-sqlite3) ship no musl prebuild for every Node release,
# so node-gyp compiles them here. Build tools stay in this stage only.
RUN apk add --no-cache python3 make g++

# Copy package files. prisma.config.ts has to be here too: it is the only place
# that points Prisma 7 at the multi-file schema, and postinstall runs
# `prisma generate`. Only the schema is copied before the install, so editing a
# seed doesn't throw away the (slow, native-compiling) install layer.
COPY package*.json prisma.config.ts ./
COPY prisma/schema ./prisma/schema/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Skip TypeScript compilation during Docker build; run via tsx at runtime

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Services store files under /var/datacendia/<name> by default (each path has an
# env override) and create them at startup; as the non-root user that failed
# with EACCES and crashed the API.
RUN mkdir -p /var/datacendia && chown nodejs:nodejs /var/datacendia

# Copy built files
# Files are owned by the runtime user at copy time. A separate chown -R
# afterwards rewrote every file in node_modules into a second multi-GB layer.
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=builder /app/src ./src
COPY --chown=nodejs:nodejs --from=builder /app/prisma ./prisma
COPY --chown=nodejs:nodejs --from=builder /app/package*.json ./
# The schema has no datasource url (Prisma 7); `prisma migrate deploy` in the
# entrypoint reads it from here.
COPY --chown=nodejs:nodejs --from=builder /app/prisma.config.ts ./

# Copy entrypoint scripts
COPY --chown=nodejs:nodejs docker-entrypoint.sh docker-entrypoint.demo.sh ./
# Strip CRLF in case the build context came from a Windows checkout.
RUN sed -i 's/\r$//' docker-entrypoint.sh docker-entrypoint.demo.sh && \
    chmod +x docker-entrypoint.sh docker-entrypoint.demo.sh && \
    chown nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start with dumb-init, run entrypoint (migrations), then app
ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
CMD ["node", "--import", "tsx", "src/index.ts"]
