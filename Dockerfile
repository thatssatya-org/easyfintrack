# Stage 1: Build the React Application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve frontend with Nginx + run API server with Node
FROM node:18-alpine

RUN apk add --no-cache nginx

WORKDIR /app

# Install production deps only (for the API server)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# Copy built React assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
RUN mkdir -p /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 8080

# Start Node API server in background, Nginx in foreground
CMD ["sh", "-c", "node server/index.js & nginx -g 'daemon off;'"]
