# Docker Deployment Guide for Polytechnic SIS

## Overview
This guide explains how to deploy the Polytechnic Student Information System using Docker and Docker Compose.

## Prerequisites
- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 1.29 or higher)
- AWS S3 credentials (for file uploads)
- MongoDB (automatically set up by docker-compose)

## Project Structure
```
abhibase/
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   └── ... (other backend files)
├── user-app/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── ... (frontend files)
├── admin-app/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── ... (frontend files)
├── docker-compose.yml
├── .env.docker
└── ... (other files)
```

## Configuration Files

### 1. `.env.docker` (Root Directory)
This file contains all environment variables for the docker-compose deployment.

Key variables:
- `MONGO_ROOT_USER` / `MONGO_ROOT_PASSWORD` - MongoDB credentials
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - JWT authentication keys
- `AWS_*` - AWS S3 credentials for file uploads
- `REACT_APP_API_URL` - Frontend API endpoint (set to `http://3.110.33.131:5000/api`)
- `CORS_ORIGIN` - Allowed origins for CORS

### 2. `docker-compose.yml` (Root Directory)
Orchestrates all services:
- **mongodb**: Database service
- **backend**: Node.js API server
- **user-app**: React user frontend (port 3000)
- **admin-app**: React admin frontend (port 3001)

## Building and Running

### Method 1: Using Docker Compose (Recommended)

#### Build Images
```bash
docker-compose -f docker-compose.yml build
```

#### Start Services
```bash
# Using .env.docker file
docker-compose --env-file .env.docker up -d

# Or simply (it uses docker-compose.yml's env settings)
docker-compose up -d
```

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f user-app
docker-compose logs -f admin-app
docker-compose logs -f mongodb
```

#### Stop Services
```bash
docker-compose down

# Remove volumes (WARNING: deletes database)
docker-compose down -v
```

#### Restart Services
```bash
docker-compose restart
```

### Method 2: Building Individual Images

#### Backend
```bash
cd backend
docker build -t polytechnic-backend:latest .
docker run -d \
  --name polytechnic-backend \
  -p 5000:5000 \
  --env-file ../.env.docker \
  polytechnic-backend:latest
```

#### User App
```bash
cd user-app
docker build \
  --build-arg REACT_APP_API_URL=http://3.110.33.131:5000/api \
  -t polytechnic-user-app:latest .
docker run -d \
  --name polytechnic-user-app \
  -p 3000:3000 \
  polytechnic-user-app:latest
```

#### Admin App
```bash
cd admin-app
docker build \
  --build-arg REACT_APP_API_URL=http://3.110.33.131:5000/api \
  -t polytechnic-admin-app:latest .
docker run -d \
  --name polytechnic-admin-app \
  -p 3001:3001 \
  polytechnic-admin-app:latest
```

## Access Points

Once running, access the applications:

- **User App**: http://3.110.33.131:3000
- **Admin App**: http://3.110.33.131:3001
- **Backend API**: http://3.110.33.131:5000/api
- **Health Check**: http://3.110.33.131:5000/api/health

## Environment Variables

### Backend (.env.docker)
```env
# Database
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/polytechnic-sis
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=admin123

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=abhi-crr
AWS_REGION=ap-south-1

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://3.110.33.131:3000,http://3.110.33.131:3001

# Logging
LOG_LEVEL=info
```

### Frontend
Automatically set during build:
- `REACT_APP_API_URL=http://3.110.33.131:5000/api`

## Service Details

### MongoDB Container
- **Image**: mongo:7.0-alpine
- **Container Name**: polytechnic-mongodb
- **Port**: 27017
- **Username**: admin
- **Password**: admin123
- **Database**: polytechnic-sis
- **Volumes**: mongodb_data, mongodb_config
- **Health Check**: Every 10 seconds

### Backend Container
- **Image**: Built from ./backend/Dockerfile
- **Container Name**: polytechnic-backend
- **Port**: 5000
- **Restart Policy**: unless-stopped
- **Health Check**: Every 30 seconds
- **Depends On**: mongodb (healthy)
- **Volumes**: ./backend/logs:/app/logs

### User App Container
- **Image**: Built from ./user-app/Dockerfile (nginx-based)
- **Container Name**: polytechnic-user-app
- **Port**: 3000
- **Restart Policy**: unless-stopped
- **Depends On**: backend (healthy)
- **Nginx Config**: user-app/nginx.conf

### Admin App Container
- **Image**: Built from ./admin-app/Dockerfile (nginx-based)
- **Container Name**: polytechnic-admin-app
- **Port**: 3001
- **Restart Policy**: unless-stopped
- **Depends On**: backend (healthy)
- **Nginx Config**: admin-app/nginx.conf

## Updating IP Address

To change the backend IP from `3.110.33.131` to another IP:

1. Update `.env.docker`:
   ```env
   REACT_APP_API_URL=http://NEW_IP:5000/api
   CORS_ORIGIN=http://NEW_IP:3000,http://NEW_IP:3001
   ```

2. Update `user-app/Dockerfile`:
   ```dockerfile
   ENV REACT_APP_API_URL=http://NEW_IP:5000/api
   ```

3. Update `admin-app/Dockerfile`:
   ```dockerfile
   ENV REACT_APP_API_URL=http://NEW_IP:5000/api
   ```

4. Update `user-app/nginx.conf` and `admin-app/nginx.conf`:
   ```nginx
   location /api/ {
       proxy_pass http://NEW_IP:5000/api/;
   }
   ```

5. Rebuild images:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

## Database Management

### Backup Database
```bash
docker exec polytechnic-mongodb mongodump \
  --username admin \
  --password admin123 \
  --authenticationDatabase admin \
  --out /backup/dump
```

### Restore Database
```bash
docker exec polytechnic-mongodb mongorestore \
  --username admin \
  --password admin123 \
  --authenticationDatabase admin \
  /backup/dump
```

### Connect to MongoDB Shell
```bash
docker exec -it polytechnic-mongodb mongosh \
  -u admin \
  -p admin123 \
  --authenticationDatabase admin
```

## Troubleshooting

### Services Not Starting
```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :27017
```

### Database Connection Issues
```bash
# Test MongoDB connection
docker exec polytechnic-mongodb ping mongodb
docker exec polytechnic-backend npm run test:db
```

### Frontend Can't Reach Backend
1. Verify backend is running: `docker ps`
2. Check CORS_ORIGIN in .env.docker
3. Test health endpoint: `curl http://3.110.33.131:5000/api/health`
4. Check nginx logs: `docker logs polytechnic-user-app`

### Rebuild Everything from Scratch
```bash
# Stop all containers
docker-compose down -v

# Remove images
docker-compose rm -f

# Rebuild
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Performance Tips

1. **Use Alpine Images**: Already configured (mongo:7.0-alpine, node:18-alpine, nginx:alpine)
2. **Build Cache**: Use `docker-compose build` without `--no-cache` unless necessary
3. **Logs**: Limit log size in production:
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```
4. **Resource Limits**: Add to docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 2G
   ```

## Security Notes

1. **Change Default Credentials**:
   - Update MONGO_ROOT_PASSWORD in .env.docker
   - Update JWT_SECRET and JWT_REFRESH_SECRET
   - Update AWS credentials

2. **CORS Configuration**:
   - Keep CORS_ORIGIN minimal in production
   - Remove localhost entries

3. **Environment File**:
   - Don't commit .env.docker to git
   - Use secrets management for production

4. **MongoDB**:
   - Change default admin password
   - Use authentication in production

## Production Deployment

For production deployments:

1. Use managed database service (AWS RDS for MongoDB)
2. Set NODE_ENV=production
3. Use strong JWT secrets (minimum 32 characters)
4. Configure SSL/TLS with reverse proxy (nginx, Traefik)
5. Implement rate limiting
6. Set up monitoring and logging
7. Use secrets management (Docker Secrets, Kubernetes Secrets)
8. Enable backup and disaster recovery

## Useful Commands

```bash
# View running containers
docker-compose ps

# Inspect a service
docker-compose exec backend npm -v

# Recreate containers
docker-compose up -d --force-recreate

# Pull latest images
docker-compose pull

# View resource usage
docker stats

# Remove unused images
docker image prune

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

## Support

For issues or questions, refer to:
- Docker Documentation: https://docs.docker.com/
- Docker Compose Documentation: https://docs.docker.com/compose/
- Node.js Documentation: https://nodejs.org/docs/
- MongoDB Documentation: https://docs.mongodb.com/
