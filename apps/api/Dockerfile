# ============================================================
# Stage 1: Pruner — Isola apenas a API e suas dependências
# ============================================================
FROM node:24-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY . .

RUN pnpm dlx turbo prune api --docker

# ============================================================
# Stage 2: Builder — Instala e builda apenas o escopo da API
# ============================================================
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate

# ADICIONADO: python3, make e g++ para o node-gyp conseguir compilar pacotes nativos
RUN apk add --no-cache git python3 make g++

# Copia os arquivos de lock isolados pelo prune
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Instala TODAS as dependências (dev included) apenas para a API
ENV CI=true
ENV HUSKY_SKIP=1
RUN pnpm install --frozen-lockfile

# Copia o código fonte filtrado e builda
COPY --from=pruner /app/out/full/ .
# SUBSTITUA "api" pelo nome do seu app!
RUN pnpm turbo run build --filter=api

# ============================================================
# Stage 3: Migrate-Runner — Mantém o src/ para tarefas de CLI
# ============================================================
FROM node:24-alpine AS migrate-runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
# ADICIONADO: pacotes de compilação aqui também por segurança
RUN apk add --no-cache git python3 make g++

ENV CI=true
ENV HUSKY_SKIP=1

# Copia o contexto buildado do Stage 2
COPY --from=builder /app /app

# O CMD padrão para ser sobrescrito pelo docker-compose.
# SUBSTITUA "api" se necessário. Executa a partir da raiz do monorepo filtrando a API.
CMD ["pnpm", "--filter", "api", "run", "migrate"]

# ============================================================
# Stage 4: Runtime — Imagem de produção enxuta
# ============================================================
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9 --activate

# 1. Copia o "esqueleto" do monorepo (pnpm-workspace.yaml, package.jsons)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Instala as ferramentas, compila as libs e remove as ferramentas logo em seguida
RUN apk add --no-cache python3 make g++ && \
    pnpm install --prod --frozen-lockfile && \
    apk del python3 make g++

COPY --from=builder /app/apps/api/dist ./apps/api/dist

# 4. Muda o foco do terminal para dentro da pasta da API
WORKDIR /app/apps/api

EXPOSE 3031

CMD ["node", "dist/index.js"]