# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy public directory
COPY public ./public

# Copy source code
COPY src ./src
COPY tailwind.config.js postcss.config.js ./

# Build the application
ENV REACT_APP_API_URL=http://13.233.148.165:5000/api
RUN npm run build

# Production stage - Nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
