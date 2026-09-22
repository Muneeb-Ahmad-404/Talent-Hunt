# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
RUN npm install -g tsx
COPY --from=builder /app/dist ./dist
COPY migrations ./migrations
# COPY .env.production ./.env

ENV NODE_ENV=production
EXPOSE 3000

# Execute migrations first, then start the Node API
CMD ["sh", "-c", "npm run migrate && node dist/server.js"]