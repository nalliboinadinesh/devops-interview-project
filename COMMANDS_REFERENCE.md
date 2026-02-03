# Commands Reference Guide

Quick reference for all commands you might need while developing.

## Starting Servers

### Option 1: Start All (Windows Batch)
```batch
# Double-click this file or run:
start-all.bat
```

### Option 2: Start All (PowerShell)
```powershell
# PowerShell terminal:
.\start-all.ps1
```

### Option 3: Manual Start (Three Separate Terminals)

**Terminal 1 - Backend (Port 5000)**:
```powershell
cd c:\OneDrive\Documents\Desktop\abhibase\backend
node server.js
```

**Terminal 2 - User App (Port 3000)**:
```powershell
cd c:\OneDrive\Documents\Desktop\abhibase\user-app
npm start
```

**Terminal 3 - Admin App (Port 3001)**:
```powershell
cd c:\OneDrive\Documents\Desktop\abhibase\admin-app
$env:PORT=3001
npm start
```

---

## Development Commands

### Backend Development

```powershell
# Install dependencies
cd backend
npm install

# Start with auto-reload (requires nodemon)
npm install -g nodemon
nodemon server.js

# Check if MongoDB is connected
curl http://localhost:5000/api/health

# Seed test data
node scripts/seed.js

# Run tests
npm test
```

### User App Development

```powershell
# Install dependencies
cd user-app
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Fix linting issues
npm run lint --fix
```

### Admin App Development

```powershell
# Install dependencies
cd admin-app
npm install

# Start dev server with custom port
$env:PORT=3001
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## Port Management

### Check What's Using a Port

```powershell
# Check port 5000 (Backend)
netstat -ano | findstr :5000

# Check port 3000 (User App)
netstat -ano | findstr :3000

# Check port 3001 (Admin App)
netstat -ano | findstr :3001

# Get process details by PID
Get-Process -Id 12345  # Replace 12345 with PID from netstat
```

### Kill Process Using Port

```powershell
# Kill process by PID
Stop-Process -Id 12345 -Force

# Kill all node processes
Get-Process node | Stop-Process -Force

# Kill specific node server
Get-Process | Where-Object {$_.Name -eq "node"} | Stop-Process -Force
```

---

## Database Commands

### MongoDB

```powershell
# Check if MongoDB is running
mongo --version

# Connect to local database
mongo

# Inside mongo shell:
# Use database
use polytechnic-sis

# List collections
show collections

# Count documents
db.students.countDocuments()

# Find students by branch
db.students.find({ branch: "CSE" })

# Update a student
db.students.updateOne(
  { _id: ObjectId("...") },
  { $set: { branch: "ECE" } }
)

# Delete a student
db.students.deleteOne({ _id: ObjectId("...") })
```

---

## API Testing Commands

### Using curl (Command Line)

```powershell
# Health check
curl http://localhost:5000/api/health

# Get all students (with pagination)
curl "http://localhost:5000/api/entities/student/list?page=1&limit=10"

# Get all materials
curl http://localhost:5000/api/entities/material/list

# Filter students by branch
curl -X POST http://localhost:5000/api/entities/student/filter `
  -H "Content-Type: application/json" `
  -d '{"filters":{"branch":"CSE"}}'

# Get single student
curl http://localhost:5000/api/entities/student/123abc

# Count students
curl -X POST http://localhost:5000/api/entities/student/count `
  -H "Content-Type: application/json" `
  -d '{"filters":{}}'
```

### Using Postman

1. Import this collection:
```json
{
  "info": {
    "name": "Polytechnic SIS API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "List Students",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/entities/student/list"
      }
    },
    {
      "name": "Filter Students",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/entities/student/filter",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"filters\":{\"branch\":\"CSE\"}}"
        }
      }
    }
  ]
}
```

---

## Git Commands

### Setup & Configuration

```powershell
# Check git status
git status

# See all changes
git diff

# See changes in staging
git diff --staged
```

### Committing Code

```powershell
# Stage all changes
git add .

# Stage specific file
git add path/to/file.js

# Commit with message
git commit -m "Add entity service and routes"

# Amend last commit
git commit --amend --no-edit

# View commit history
git log --oneline -10
```

### Branching

```powershell
# Create new branch
git checkout -b feature/student-search

# Switch branch
git checkout main

# Delete branch
git branch -d feature/student-search

# List branches
git branch -a
```

### Pushing & Pulling

```powershell
# Push current branch
git push origin feature/student-search

# Pull latest changes
git pull origin main

# Force push (use carefully!)
git push -f origin feature/student-search
```

---

## NPM Commands

### Dependency Management

```powershell
# Install all dependencies
npm install

# Install specific package
npm install react-query

# Install as dev dependency
npm install -D webpack

# Uninstall package
npm uninstall react-query

# Update all packages
npm update

# Check outdated packages
npm outdated

# Clean cache
npm cache clean --force
```

### Package Management

```powershell
# List installed packages
npm list

# Show package info
npm info react-query

# Search npm registry
npm search authentication

# Create package-lock.json (without installing)
npm ci

# Rebuild native modules
npm rebuild
```

---

## Debugging

### Frontend Debugging

```javascript
// In browser console:

// Check if API client is working
apiClient.list('student').then(res => console.log(res));

// Check auth token
localStorage.getItem('auth_token');

// Decode JWT manually
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);

// Check Redux state (if using)
console.log(store.getState());

// Monitor React Query cache
import { useQueryClient } from '@tanstack/react-query';
const queryClient = useQueryClient();
console.log(queryClient.getQueryData(['students']));
```

### Backend Debugging

```powershell
# Check Node.js version
node --version

# Run with debug logs
DEBUG=app node server.js

# Run with verbose output
node --trace-warnings server.js

# Check memory usage
Get-Process -Name node | select Id, Name, WorkingSet
```

### MongoDB Debugging

```powershell
# Check MongoDB connection
mongo --eval "db.adminCommand('ping')"

# Show database size
mongo --eval "db.stats()"

# Count documents in collection
mongo --eval "db.students.countDocuments()"

# Find slow queries
mongo --eval "db.setProfilingLevel(1, { slowms: 100 })"
```

---

## Useful Browser DevTools Commands

### Network Tab
- Filter by XHR (XMLHttpRequest) to see API calls
- Check Headers tab for Authorization token
- Check Response tab for API responses
- Check Timing tab for performance

### Application Tab
- Local Storage: Check auth_token
- Session Storage: Check temporary data
- IndexedDB: Check React Query cache
- Cookies: Check any session cookies

### Console Tab
```javascript
// Test API client
import apiClient from './api/apiClient';
apiClient.list('student').then(res => console.log(res));

// Test auth
import authClient from './api/authClient';
authClient.isAuthenticated(); // true/false
authClient.getCurrentUser(); // { id, email, role }

// Clear cache
localStorage.clear(); // Clear all localStorage
localStorage.removeItem('auth_token'); // Clear specific key
```

---

## Common Issues & Fixes

### Issue: "Address already in use"

```powershell
# Find and kill process using port
Get-Process node | Stop-Process -Force

# Or specific port:
netstat -ano | findstr :5000
# Then kill by PID:
Stop-Process -Id 12345 -Force
```

### Issue: "Module not found"

```powershell
# Reinstall dependencies
rm -r node_modules
npm install

# Clear npm cache
npm cache clean --force
npm install
```

### Issue: "EACCES: permission denied"

```powershell
# Run with admin privileges
# Or fix permissions:
npm install -g npm  # Update npm
```

### Issue: "Cannot connect to MongoDB"

```powershell
# Check MongoDB is running
mongo --version

# Start MongoDB (if using local)
# Windows: Services → MongoDB → Start
# Or: mongod

# Check connection string in .env
# Should be: mongodb://localhost:27017/polytechnic-sis
```

### Issue: "CORS error"

```powershell
# Check backend has CORS enabled in server.js:
# app.use(cors({
#   origin: ["http://localhost:3000", "http://localhost:3001"],
#   credentials: true
# }));

# Check frontend API URL in .env.local:
# REACT_APP_API_URL=http://localhost:5000/api
```

---

## Performance Monitoring

### Monitor Terminal Output

```powershell
# See memory usage
Get-Process node | select Id, Name, WorkingSet | Format-Table

# Monitor API response times
Measure-Command {
  curl http://localhost:5000/api/entities/student/list
}

# See request count (check network tab in DevTools)
# Filter by XHR in Chrome DevTools Network tab
```

### Browser DevTools Performance

1. Open DevTools → Performance tab
2. Click Record
3. Perform action (search, create, etc.)
4. Click Stop
5. Analyze timeline for bottlenecks

### React DevTools

1. Install React DevTools extension
2. Open DevTools → Profiler tab
3. Record user interaction
4. See which components re-render
5. Identify performance issues

---

## Documentation & Resources

### Local Files
- [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) - System architecture
- [QUICK_START.md](./QUICK_START.md) - Quick startup guide  
- [COMPONENT_INTEGRATION_GUIDE.md](./COMPONENT_INTEGRATION_GUIDE.md) - Component migration guide
- [SERVERS_RUNNING.md](./SERVERS_RUNNING.md) - Current server status

### External Resources
- [React Query Docs](https://tanstack.com/query/latest)
- [Mongoose ODM](https://mongoosejs.com/)
- [Express.js](https://expressjs.com/)
- [JWT.io](https://jwt.io/) - Decode JWTs
- [MongoDB Shell](https://docs.mongodb.com/mongodb-shell/)

---

## Quick Reference Card

```
🚀 START:           .\start-all.bat
📊 ACCESS:          User: 3000 | Admin: 3001 | API: 5000
🔐 LOGIN:           admin / admin123
📝 LOGS:            Check browser console & terminal windows
🔍 DEBUG:           Network tab (XHR) & LocalStorage
🗄️  DATABASE:        mongo (shell)
❌ KILL PORTS:       Stop-Process -Name node -Force
📚 DOCS:            See markdown files in root
```

---

**Last Updated**: 2024-01-15
**Status**: Production Ready ✅
