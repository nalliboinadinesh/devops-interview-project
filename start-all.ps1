# Script to start all three servers in parallel
# Usage: .\start-all.ps1

param(
    [switch]$Kill = $false  # Kill existing processes first
)

$rootPath = "c:\OneDrive\Documents\Desktop\abhibase"
$backendPath = "$rootPath\backend"
$userAppPath = "$rootPath\user-app"
$adminAppPath = "$rootPath\admin-app"

# Colors for output
$InfoColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"

Write-Host "=" * 60 -ForegroundColor $InfoColor
Write-Host "Starting Polytechnic SIS - All Three Servers" -ForegroundColor $InfoColor
Write-Host "=" * 60 -ForegroundColor $InfoColor

# Kill existing processes if requested
if ($Kill) {
    Write-Host "`nKilling existing Node processes..." -ForegroundColor $WarningColor
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# Check if processes are already running
$existingNode = Get-Process node -ErrorAction SilentlyContinue
if ($existingNode) {
    Write-Host "Warning: Existing Node processes detected:" -ForegroundColor $WarningColor
    $existingNode | Select-Object -Property ProcessName, Id, CPU | Format-Table
    Write-Host "Consider running: .\start-all.ps1 -Kill" -ForegroundColor $WarningColor
}

# Function to start a server
function Start-Server {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [string]$Port
    )
    
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Starting $Name..." -ForegroundColor $InfoColor
    
    if (-not (Test-Path $Path)) {
        Write-Host "❌ Error: Path not found - $Path" -ForegroundColor $ErrorColor
        return $null
    }
    
    try {
        $process = Start-Process powershell `
            -ArgumentList "-NoExit -Command `"cd '$Path'; $Command`"" `
            -WindowStyle Normal `
            -PassThru `
            -ErrorAction Stop
        
        Write-Host "✓ $Name started (PID: $($process.Id), Port: $Port)" -ForegroundColor $InfoColor
        return $process
    }
    catch {
        Write-Host "❌ Failed to start $Name : $_" -ForegroundColor $ErrorColor
        return $null
    }
}

# Start all three servers
$backendProcess = Start-Server `
    -Name "Backend Server" `
    -Path $backendPath `
    -Command "node server.js" `
    -Port 5000

$userAppProcess = Start-Server `
    -Name "User App" `
    -Path $userAppPath `
    -Command "npm start" `
    -Port 3000

$adminAppProcess = Start-Server `
    -Name "Admin App" `
    -Path $adminAppPath `
    -Command "`$env:PORT=3001; npm start" `
    -Port 3001

# Display running servers
Write-Host "`n" -ForegroundColor $InfoColor
Write-Host "=" * 60 -ForegroundColor $InfoColor
Write-Host "All Servers Started!" -ForegroundColor $InfoColor
Write-Host "=" * 60 -ForegroundColor $InfoColor

Write-Host "`n📍 Access Points:" -ForegroundColor $InfoColor
Write-Host "   • Backend API: http://localhost:5000/api" -ForegroundColor $InfoColor
Write-Host "   • User App:    http://localhost:3000" -ForegroundColor $InfoColor
Write-Host "   • Admin App:   http://localhost:3001" -ForegroundColor $InfoColor
Write-Host "   • Login:       admin / admin123" -ForegroundColor $InfoColor

Write-Host "`n📋 Running Processes:" -ForegroundColor $InfoColor
@($backendProcess, $userAppProcess, $adminAppProcess) | 
    Where-Object { $_ } | 
    Select-Object -Property @{Name="Server";Expression={if($_.Id -eq $backendProcess.Id){"Backend"}elseif($_.Id -eq $userAppProcess.Id){"User App"}else{"Admin App"}}}, Id, ProcessName |
    Format-Table

Write-Host "`n⚠️  Commands:" -ForegroundColor $WarningColor
Write-Host "   Press Enter to show more options..." -ForegroundColor $WarningColor
Read-Host | Out-Null

$menuActive = $true
while ($menuActive) {
    Write-Host "`n" -ForegroundColor $InfoColor
    Write-Host "1. Check server status" -ForegroundColor $InfoColor
    Write-Host "2. Restart all servers" -ForegroundColor $InfoColor
    Write-Host "3. Stop all servers and exit" -ForegroundColor $ErrorColor
    Write-Host "4. Clear and reinstall npm modules" -ForegroundColor $WarningColor
    
    $choice = Read-Host "`nSelect option (1-4)"
    
    switch ($choice) {
        "1" {
            Write-Host "`n📊 Server Status:" -ForegroundColor $InfoColor
            Get-Process node -ErrorAction SilentlyContinue | 
                Select-Object -Property ProcessName, Id, @{Name="Runtime";Expression={(Get-Date) - $_.StartTime | select -ExpandProperty TotalSeconds | ForEach-Object {"{0:N0}s" -f $_}}} |
                Format-Table
        }
        "2" {
            Write-Host "`nRestarting servers..." -ForegroundColor $WarningColor
            $backendProcess, $userAppProcess, $adminAppProcess | 
                Where-Object { $_ } | 
                Stop-Process -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            
            $backendProcess = Start-Server -Name "Backend Server" -Path $backendPath -Command "node server.js" -Port 5000
            $userAppProcess = Start-Server -Name "User App" -Path $userAppPath -Command "npm start" -Port 3000
            $adminAppProcess = Start-Server -Name "Admin App" -Path $adminAppPath -Command "set PORT=3001 && npm start" -Port 3001
        }
        "3" {
            Write-Host "`nStopping all servers..." -ForegroundColor $ErrorColor
            $backendProcess, $userAppProcess, $adminAppProcess | 
                Where-Object { $_ } | 
                Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "✓ All servers stopped." -ForegroundColor $InfoColor
            $menuActive = $false
        }
        "4" {
            Write-Host "`nClearing npm cache and modules..." -ForegroundColor $WarningColor
            npm cache clean --force
            
            @($backendPath, $userAppPath, $adminAppPath) | ForEach-Object {
                Write-Host "Reinstalling $_..." -ForegroundColor $WarningColor
                Push-Location $_
                Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
                Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
                npm install
                Pop-Location
            }
            
            Write-Host "✓ Reinstallation complete. Restarting servers..." -ForegroundColor $InfoColor
            $backendProcess = Start-Server -Name "Backend Server" -Path $backendPath -Command "node server.js" -Port 5000
            $userAppProcess = Start-Server -Name "User App" -Path $userAppPath -Command "npm start" -Port 3000
            $adminAppProcess = Start-Server -Name "Admin App" -Path $adminAppPath -Command "`$env:PORT=3001; npm start" -Port 3001
        }
        default {
            Write-Host "Invalid option. Please try again." -ForegroundColor $ErrorColor
        }
    }
}

Write-Host "`nGoodbye! 👋" -ForegroundColor $InfoColor
