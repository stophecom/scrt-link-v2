FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application with Node adapter
ENV ADAPTER=node
ARG CSRF_CHECK_ORIGIN=true
ENV CSRF_CHECK_ORIGIN=$CSRF_CHECK_ORIGIN
RUN pnpm build

# Minimal runner image
FROM node:25-alpine AS runner

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "build"]
