# ============================================================
# Stage 1: builder — full source + all deps, builds dist/
# ============================================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN apk add --no-cache git

RUN corepack enable && corepack prepare pnpm@9 --activate

ENV CI=true
ENV HUSKY_SKIP=1

# Install ALL dependencies (dev included — ts-node needed to build)
RUN pnpm install

# Build the API (outputs to dist/)
RUN pnpm run build

# ============================================================
# Stage 2: migrate-runner — keeps src/ + ts-node for CLI tasks
# Used by docker-compose migrate & seed services
# ============================================================
FROM node:24-alpine AS migrate-runner

WORKDIR /app

COPY . .

RUN apk add --no-cache git

RUN corepack enable && corepack prepare pnpm@9 --activate

ENV CI=true
ENV HUSKY_SKIP=1

# Install ALL deps so ts-node, tsconfig-paths, sequelize-cli are available
RUN pnpm install

# Default CMD is overridden by docker-compose (migrate / seed)
CMD ["pnpm", "run", "migrate"]

# ============================================================
# Stage 3: runtime — minimal production image
# ============================================================
FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3031

CMD ["node", "dist/index.js"]