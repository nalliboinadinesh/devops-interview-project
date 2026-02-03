@echo off
REM Start all three servers in separate windows
REM Run this file to launch the entire application stack

setlocal enabledelayedexpansion

set ROOT_PATH=c:\OneDrive\Documents\Desktop\abhibase
set BACKEND_PATH=%ROOT_PATH%\backend
set USER_APP_PATH=%ROOT_PATH%\user-app
set ADMIN_APP_PATH=%ROOT_PATH%\admin-app

echo.
echo ========================================================
echo Starting Polytechnic SIS - All Three Servers
echo ========================================================
echo.

REM Start Backend Server (Port 5000)
echo [%date% %time%] Starting Backend Server...
start "Backend Server (5000)" cmd /k "cd /d %BACKEND_PATH% && node server.js"
timeout /t 2 /nobreak

REM Start User App (Port 3000)
echo [%date% %time%] Starting User App...
start "User App (3000)" cmd /k "cd /d %USER_APP_PATH% && npm start"
timeout /t 2 /nobreak

REM Start Admin App (Port 3001)
echo [%date% %time%] Starting Admin App...
start "Admin App (3001)" cmd /k "cd /d %ADMIN_APP_PATH% && set PORT=3001 && npm start"
timeout /t 2 /nobreak

echo.
echo ========================================================
echo All servers started!
echo ========================================================
echo.
echo Access Points:
echo   - Backend API: http://localhost:5000/api
echo   - User App:    http://localhost:3000
echo   - Admin App:   http://localhost:3001
echo   - Login:       admin / admin123
echo.
echo Server windows will open separately.
echo Close a window to stop that server.
echo.
pause
