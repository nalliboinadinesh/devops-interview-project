# Docker Setup Complete ✓

## Files Created

### 1. Docker Images
- **backend/Dockerfile** - Multi-stage build for Node.js backend
- **user-app/Dockerfile** - React build + Nginx production server
- **admin-app/Dockerfile** - React build + Nginx production server

### 2. Nginx Configuration
- **user-app/nginx.conf** - Nginx config for user app (port 3000)
- **admin-app/nginx.conf** - Nginx config for admin app (port 3001)

### 3. Docker Compose
- **docker-compose.yml** - Orchestrates all services:
  - MongoDB (database)
  - Backend (API server)
  - User App (frontend)
  - Admin App (frontend)

### 4. Environment Configuration
- **.env.docker** - Environment variables for docker-compose deployment
  - IP: 3.110.33.131
  - Ports: 5000 (backend), 3000 (user), 3001 (admin), 27017 (mongo)
  - AWS S3 credentials configured
  - MongoDB credentials configured

### 5. Startup Scripts
- **docker-start.ps1** - PowerShell script for Windows
- **docker-start.sh** - Bash script for Linux/Mac

### 6. Documentation
- **DOCKER_DEPLOYMENT_GUIDE.md** - Comprehensive guide with all commands
- **DOCKER_QUICK_REFERENCE.md** - Quick reference for common tasks

## Features Configured

### Frontend to Backend Connection
- ✅ Updated API URLs to use: `http://3.110.33.131:5000/api`
- ✅ Nginx proxy configured to forward /api/ requests
- ✅ Both user-app and admin-app configured with same backend IP

### Environment Variables
- ✅ MongoDB credentials set
- ✅ JWT secrets configured
- ✅ AWS S3 credentials included
- ✅ CORS origin updated for IP
- ✅ All services use .env.docker

### Health Checks
- ✅ MongoDB health check every 10s
- ✅ Backend health check every 30s
- ✅ Services wait for dependencies before starting

### Networking
- ✅ All services on same network (polytechnic-network)
- ✅ Service discovery via container names
- ✅ Ports exposed for access

### Volumes
- ✅ MongoDB persistent storage (mongodb_data, mongodb_config)
- ✅ Backend logs volume (/app/logs)

## Quick Start

### Windows (PowerShell)
```powershell
# Start all services
.\docker-start.ps1 start

# View logs
.\docker-start.ps1 logs

# Stop services
.\docker-start.ps1 stop
```

### Linux/Mac (Bash)
```bash
# Make executable
chmod +x docker-start.sh

# Start all services
./docker-start.sh start

# View logs
./docker-start.sh logs

# Stop services
./docker-start.sh stop
```

### Manual Docker Compose
```bash
# Build images
docker-compose build

# Start services
docker-compose --env-file .env.docker up -d

# View status
docker-compose ps

# Stop services
docker-compose down
```

## Access Points

Once running:
- **User App**: http://3.110.33.131:3000
- **Admin App**: http://3.110.33.131:3001
- **Backend API**: http://3.110.33.131:5000/api
- **Health Check**: http://3.110.33.131:5000/api/health

## Services Overview

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| MongoDB | mongo:7.0-alpine | 27017 | Database |
| Backend | Node.js (custom build) | 5000 | API Server |
| User App | Nginx (custom React build) | 3000 | Student Frontend |
| Admin App | Nginx (custom React build) | 3001 | Admin Frontend |

## Environment Details

### Backend Configuration
- MongoDB: `mongodb://admin:admin123@mongodb:27017/polytechnic-sis`
- Port: 5000
- Node Environment: production
- S3 Bucket: abhi-crr
- S3 Region: ap-south-1

### Frontend Configuration
- User App API URL: `http://3.110.33.131:5000/api`
- Admin App API URL: `http://3.110.33.131:5000/api`
- Both apps built and served by Nginx

### CORS Configuration
- Allowed Origins: 
  - http://localhost:3000
  - http://localhost:3001
  - http://3.110.33.131:3000
  - http://3.110.33.131:3001

## Changing IP Address

To use a different IP (e.g., 192.168.1.100):

1. Edit `.env.docker`:
```env
REACT_APP_API_URL=http://192.168.1.100:5000/api
CORS_ORIGIN=http://192.168.1.100:3000,http://192.168.1.100:3001
```

2. Update `user-app/Dockerfile`:
```dockerfile
ENV REACT_APP_API_URL=http://192.168.1.100:5000/api
```

3. Update `admin-app/Dockerfile`:
```dockerfile
ENV REACT_APP_API_URL=http://192.168.1.100:5000/api
```

4. Update nginx configs in both apps to proxy to new IP

5. Rebuild:
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Database Management

### Backup
```bash
docker exec polytechnic-mongodb mongodump \
  --username admin \
  --password admin123 \
  --authenticationDatabase admin \
  --out /backup/dump
```

### Restore
```bash
docker exec polytechnic-mongodb mongorestore \
  --username admin \
  --password admin123 \
  --authenticationDatabase admin \
  /backup/dump
```

### Connect to Shell
```bash
docker exec -it polytechnic-mongodb mongosh \
  -u admin \
  -p admin123 \
  --authenticationDatabase admin
```

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend
```

### Port conflicts
```bash
# Windows: Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Full reset
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## File Locations

### Docker Files
```
abhibase/
├── docker-compose.yml
├── .env.docker
├── docker-start.ps1
├── docker-start.sh
├── DOCKER_DEPLOYMENT_GUIDE.md
└── DOCKER_QUICK_REFERENCE.md
```

### Service Dockerfiles
```
backend/Dockerfile
user-app/Dockerfile
user-app/nginx.conf
admin-app/Dockerfile
admin-app/nginx.conf
```

## Deployment Checklist

- [x] Backend Dockerfile created with multi-stage build
- [x] Frontend Dockerfiles created with Nginx
- [x] docker-compose.yml configured with all services
- [x] .env.docker created with all environment variables
- [x] IP address set to 3.110.33.131
- [x] API URLs updated in frontend
- [x] Nginx configs created with proxy settings
- [x] MongoDB configured with credentials
- [x] S3 credentials configured
- [x] CORS configured for IP
- [x] Health checks added
- [x] Volumes configured for persistence
- [x] Startup scripts created (PS1 and SH)
- [x] Documentation completed

## Next Steps

1. Review and update credentials in `.env.docker` if needed
2. Run `docker-compose build` to build images
3. Run `docker-compose up -d` to start services
4. Verify all services are running: `docker-compose ps`
5. Test health check: `curl http://3.110.33.131:5000/api/health`
6. Access applications:
   - User App: http://3.110.33.131:3000
   - Admin App: http://3.110.33.131:3001

## Support & Documentation

For detailed information:
- **DOCKER_DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
- **DOCKER_QUICK_REFERENCE.md** - Quick reference for common commands

For issues:
- Check Docker logs: `docker-compose logs`
- Check service status: `docker-compose ps`
- Review docker-compose.yml configuration
- Verify environment variables in .env.docker
