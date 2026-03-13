# Use a smaller base image
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# # Copy only the essential files first for dependency installation
COPY . .

# Install git, pnpm, and husky globally
RUN apk add --no-cache git

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9 --activate

# Set CI environment variable to true to prevent husky from running
ENV CI=true
ENV HUSKY_SKIP=1

# Install dependencies
RUN pnpm install

# Build the API
RUN pnpm run build --filter=agents/api

# Use pnpm deploy to create a self-contained directory with all dependencies
# This properly handles pnpm workspace symlinks by copying actual files
# --legacy flag is needed for pnpm v10+ without inject-workspace-packages
RUN pnpm deploy --filter=agents/api --prod --legacy /app/deployed

# ----------------------------------------------------------

# Use a minimal runtime image to reduce size
FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /app

# Copy the deployed directory which contains node_modules with real files (not symlinks)
COPY --from=builder /app/deployed/node_modules ./node_modules
COPY --from=builder /app/deployed/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist

# Expose port
EXPOSE 8000

# Start the application with increased speed and reduced startup time
CMD ["node", "--enable-source-maps", "--optimize_for_size", "--max_old_space_size=256", "./dist/bootstrap.js"]