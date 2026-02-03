# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running (local or cloud)
- All dependencies installed (`npm install` in each folder)

## Starting All Three Servers

### Option 1: Run in Separate Terminal Windows (Recommended)

**Terminal 1 - Backend (Port 5000):**
```powershell
cd c:\OneDrive\Documents\Desktop\abhibase\backend
node server.js
```

**Terminal 2 - User App (Port 3000):**
```powershell
cd c:\OneDrive\Documents\Desktop\abhibase\user-app
npm start
```

**Terminal 3 - Admin App (Port 3001):**
```powershell
cd c:\OneDrive\Documents\Desktop\abhibase\admin-app
set PORT=3001 && npm start
```

### Option 2: Run All at Once (Windows PowerShell)

Create a file `start-all.ps1` in the root directory:

```powershell
# Kill any existing node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Start all three servers in parallel
$backend = Start-Process powershell -ArgumentList "-NoExit -Command cd 'c:\OneDrive\Documents\Desktop\abhibase\backend'; node server.js" -PassThru
$userApp = Start-Process powershell -ArgumentList "-NoExit -Command cd 'c:\OneDrive\Documents\Desktop\abhibase\user-app'; npm start" -PassThru
$adminApp = Start-Process powershell -ArgumentList "-NoExit -Command cd 'c:\OneDrive\Documents\Desktop\abhibase\admin-app'; set PORT=3001 && npm start" -PassThru

Write-Host "All servers started!"
Write-Host "Backend: http://localhost:5000"
Write-Host "User App: http://localhost:3000"
Write-Host "Admin App: http://localhost:3001"

# Keep script running
Read-Host "Press Enter to stop all servers..."

# Stop all servers
Stop-Process -Id $backend.Id, $userApp.Id, $adminApp.Id
```

Then run:
```powershell
.\start-all.ps1
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polytechnic-sis
JWT_SECRET=your-secret-key
```

### User App (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Admin App (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Accessing the Applications

1. **User App** - http://localhost:3000
   - Public access (no login required)
   - Browse students, materials, papers, announcements

2. **Admin App** - http://localhost:3001
   - Login required
   - Demo credentials: `admin` / `admin123`
   - Full CRUD on all entities

3. **Backend API** - http://localhost:5000/api
   - `/api/health` - Health check
   - `/api/entities/{entity}/list` - List records
   - `/api/entities/{entity}/{id}` - Get record
   - etc...

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Check if port 5000 is already in use: `netstat -ano | findstr :5000`
- Check MongoDB connection string in .env

### User/Admin App won't start
- Clear node_modules and reinstall: `rm -r node_modules && npm install`
- Clear package-lock.json cache: `npm cache clean --force`
- Check if ports 3000/3001 are available

### Components not loading
- Check browser console for errors
- Verify API_URL is correct in .env.local
- Check backend is running and accessible

### Authentication issues
- Clear localStorage: `localStorage.clear()`
- Check JWT token in browser DevTools > Application > Storage
- Verify auth endpoint is working: `curl http://localhost:5000/api/auth/login`

## Testing the Flow

1. Start all three servers
2. Open http://localhost:3000 (User App)
   - Should show home page with search and materials
3. Open http://localhost:3001 (Admin App)
   - Should redirect to login
   - Login with admin/admin123
   - Navigate to Dashboard
4. Create a student in Admin App
   - Verify it appears in User App search

## Common Commands

```powershell
# Check if servers are running
Get-Process -Name node | Select-Object Id, ProcessName, StartTime

# Stop all node processes
Get-Process node | Stop-Process

# Check if port is in use
netstat -ano | findstr :5000  # Backend
netstat -ano | findstr :3000  # User App
netstat -ano | findstr :3001  # Admin App

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install --save-dev
```

## Architecture

```
User App (3000)          Admin App (3001)
    ↓                         ↓
  Hooks ←────────────→ Backend API (5000)
                            ↓
                      EntityService
                            ↓
                        MongoDB
```

## Next Steps

1. ✅ Start all three servers
2. ✅ Test user app with existing data
3. ✅ Test admin login and CRUD operations
4. ✅ Create/Edit/Delete records in admin
5. ✅ Verify changes appear in user app
6. ⬜ Implement file upload (materials/papers)
7. ⬜ Add real-time notifications (optional)
