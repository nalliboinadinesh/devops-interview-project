# Accessing System via IP Address

## Problem Fixed
The system now supports accessing the admin and user panels via IP addresses (not just localhost). Previously, data updates weren't syncing because CORS was rejecting requests from IP addresses.

## What Changed
1. **Backend CORS Configuration**: Updated to dynamically allow any origin in development mode and support various localhost formats
2. **Docker Compose**: Extended CORS_ORIGIN to include 127.0.0.1 variants

## How to Access via IP

### Find Your Machine IP
```powershell
# Windows PowerShell
ipconfig
# Look for "IPv4 Address" under your active network connection
# Example: 192.168.x.x or 10.x.x.x
```

### Access the Panels
1. **User Panel**: `http://YOUR_IP:3000`
2. **Admin Panel**: `http://YOUR_IP:3001`
3. **Backend API**: `http://YOUR_IP:5000/api`

### Verify Connectivity
```bash
# Test backend API health
curl http://YOUR_IP:5000/api/health

# Should return:
# {"status":"API is running","timestamp":"..."}
```

## Data Sync Verification

### In Admin Panel:
1. Log in to admin panel
2. Create or update any record (Student, Material, Announcement, etc.)
3. Click Save

### In User Panel (or different browser):
1. Access the user panel on the same IP
2. Verify the data appears/updates immediately
3. Check browser console (F12) for any CORS errors

## Troubleshooting

### Issue: Still not syncing data
**Solution**: Restart Docker containers:
```bash
docker-compose down
docker-compose up -d
```

### Issue: "CORS error" in browser console
**Possible causes**:
- Using a different port than 3000/3001 for frontend
- Containers not restarted after changes
- Firewall blocking cross-origin requests

**Solution**: Update CORS_ORIGIN in docker-compose.yml:
```yaml
CORS_ORIGIN: http://YOUR_IP:3000,http://YOUR_IP:3001
```

### Issue: Can't connect to IP address
**Check**:
1. Both machines on same network
2. Firewall allows ports 5000, 3000, 3001
3. IP address is correct (run `ipconfig`)
4. Services are running: `docker-compose ps`

## Production Considerations
For production deployment, set specific CORS origins in environment variables rather than relying on the catch-all behavior.

## Network Access Tips
- **Local Network**: Use your machine's internal IP (192.168.x.x)
- **Docker Desktop with WSL**: May need to use 127.0.0.1 instead of localhost
- **Multiple Devices**: All devices must be on the same network
