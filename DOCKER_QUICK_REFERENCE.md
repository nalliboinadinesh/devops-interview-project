# Docker Quick Reference Guide

## Quick Start

### Windows (PowerShell)
```powershell
# Start services
.\docker-start.ps1 start

# View logs
.\docker-start.ps1 logs

# Stop services
.\docker-start.ps1 stop
```

### Linux/Mac (Bash)
```bash
# Make script executable
chmod +x docker-start.sh

# Start services
./docker-start.sh start

# View logs
./docker-start.sh logs

# Stop services
./docker-start.sh stop
```

### Manual Commands
```bash
# Build images
docker-compose build

# Start services
docker-compose --env-file .env.docker up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Access Points

Once running:
- **User App**: http://3.110.33.131:3000
- **Admin App**: http://3.110.33.131:3001
- **API**: http://3.110.33.131:5000/api
- **Health**: http://3.110.33.131:5000/api/health

## Configuration

### Update IP Address
Edit `.env.docker`:
```env
# Change 3.110.33.131 to your IP
REACT_APP_API_URL=http://3.110.33.131:5000/api
CORS_ORIGIN=http://3.110.33.131:3000,http://3.110.33.131:3001
```

### Update AWS Credentials
Edit `.env.docker`:
```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=your-bucket
AWS_REGION=ap-south-1
```

### Update MongoDB Credentials
Edit `.env.docker`:
```env
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=your-password
```

## Common Tasks

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f user-app
docker-compose logs -f admin-app
docker-compose logs -f mongodb
```

### Check Service Status
```bash
docker-compose ps
```

### Connect to MongoDB
```bash
docker exec -it polytechnic-mongodb mongosh \
  -u admin \
  -p admin123 \
  --authenticationDatabase admin
```

### Rebuild Specific Service
```bash
docker-compose build backend
docker-compose up -d backend
```

### View Resource Usage
```bash
docker stats
```

### Clean Up Unused Resources
```bash
docker system prune
docker system prune -a  # Remove unused images too
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check if ports are in use
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :5000
lsof -i :3000
```

### Database Connection Issues
```bash
# Test MongoDB connection
docker exec polytechnic-mongodb ping localhost
```

### Frontend Can't Reach Backend
1. Verify backend is running: `docker-compose ps`
2. Test health endpoint: `curl http://3.110.33.131:5000/api/health`
3. Check CORS settings in `.env.docker`
4. Rebuild frontend: `docker-compose build user-app`

### Full Reset
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose rm -f

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## File Structure

```
abhibase/
├── docker-compose.yml          # Main orchestration file
├── .env.docker                 # Environment variables
├── docker-start.ps1            # Windows start script
├── docker-start.sh             # Linux/Mac start script
│
├── backend/
│   ├── Dockerfile              # Backend container config
│   ├── server.js               # Main server file
│   ├── package.json
│   └── ...
│
├── user-app/
│   ├── Dockerfile              # User app container config
│   ├── nginx.conf              # Nginx configuration
│   ├── package.json
│   └── ...
│
└── admin-app/
    ├── Dockerfile              # Admin app container config
    ├── nginx.conf              # Nginx configuration
    ├── package.json
    └── ...
```

## Environment Variables Reference

### Backend
| Variable | Default | Purpose |
|----------|---------|---------|
| MONGODB_URI | mongodb://admin:admin123@mongodb:27017/polytechnic-sis | Database connection |
| PORT | 5000 | Backend port |
| NODE_ENV | production | Environment |
| JWT_SECRET | (required) | JWT signing key |
| JWT_EXPIRE | 7d | Token expiration |
| AWS_ACCESS_KEY_ID | (required) | AWS credentials |
| AWS_SECRET_ACCESS_KEY | (required) | AWS credentials |
| AWS_BUCKET_NAME | abhi-crr | S3 bucket name |
| AWS_REGION | ap-south-1 | AWS region |
| CORS_ORIGIN | multiple | Allowed origins |

### Frontend
| Variable | Default | Purpose |
|----------|---------|---------|
| REACT_APP_API_URL | http://3.110.33.131:5000/api | Backend URL |

## Port Mapping

| Service | Container Port | Host Port | Purpose |
|---------|-----------------|-----------|---------|
| MongoDB | 27017 | 27017 | Database |
| Backend | 5000 | 5000 | API Server |
| User App | 3000 | 3000 | User Frontend |
| Admin App | 3001 | 3001 | Admin Frontend |

## Health Checks

Services include health checks that verify they're running correctly:

```bash
# Backend health check
curl http://3.110.33.131:5000/api/health

# Expected response
{ "status": "OK", "timestamp": "2024-01-25T10:00:00Z" }
```

## Performance Optimization

1. **Use .dockerignore**: Exclude unnecessary files from build context
2. **Layer Caching**: Dockerfile uses multi-stage builds for optimal layer caching
3. **Alpine Images**: Lightweight base images (mongo:alpine, node:alpine, nginx:alpine)
4. **Nginx for Frontend**: Production-grade web server instead of development server

## Production Considerations

- [ ] Use strong JWT secrets (minimum 32 characters)
- [ ] Change default MongoDB credentials
- [ ] Update AWS credentials
- [ ] Configure SSL/TLS with reverse proxy
- [ ] Set LOG_LEVEL=warn or error
- [ ] Enable database backups
- [ ] Set NODE_ENV=production
- [ ] Use environment-specific configuration
- [ ] Implement monitoring and alerting
- [ ] Review CORS origins

## Support

For more information, see:
- `DOCKER_DEPLOYMENT_GUIDE.md` - Comprehensive guide
- Docker Docs: https://docs.docker.com/
- Docker Compose Docs: https://docs.docker.com/compose/
