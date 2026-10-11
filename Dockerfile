# ============================================================================
# CARDIO-ML 3D Intelligence Diagnostic Hub
# Multi-Stage Production Container for Google Cloud Run
# ============================================================================

FROM node:22-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Build production assets
COPY . .
RUN npm run build

# ============================================================================
# Production Runner
# ============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy built frontend assets and server sources
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src

EXPOSE 8080

# Run full-stack production server
CMD ["node", "server.ts"]
