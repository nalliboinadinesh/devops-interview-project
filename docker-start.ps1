# Docker Compose Quick Start Script for Polytechnic SIS (Windows PowerShell)
# Usage: .\docker-start.ps1 [command]
# Commands: start, stop, restart, logs, build, clean, rebuild

param(
    [string]$Command = "start"
)

$DockerCompose = "docker-compose"
$EnvFile = ".env.docker"
$ComposeFile = "docker-compose.yml"

# Colors for output
function Write-Header {
    param([string]$Message)
    Write-Host "=================================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "=================================================" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

# Check if Docker is installed
function Check-Docker {
    try {
        $null = docker version
        Write-Success "Docker is installed"
        return $true
    }
    catch {
        Write-Error-Custom "Docker is not installed or not in PATH"
        return $false
    }
}

# Check if Docker Compose is installed
function Check-DockerCompose {
    try {
        $null = docker-compose version
        Write-Success "Docker Compose is installed"
        return $true
    }
    catch {
        Write-Error-Custom "Docker Compose is not installed or not in PATH"
        return $false
    }
}

# Check if .env.docker exists
function Check-EnvFile {
    if (-not (Test-Path $EnvFile)) {
        Write-Warning-Custom ".env.docker not found"
        if (Test-Path ".env.docker.example") {
            Copy-Item ".env.docker.example" $EnvFile
            Write-Success ".env.docker created from template"
        }
        else {
            Write-Error-Custom ".env.docker not found and no template available"
            exit 1
        }
    }
}

# Start services
function Start-Services {
    Write-Header "Starting Polytechnic SIS Services"
    
    if (-not (Check-Docker)) { exit 1 }
    if (-not (Check-DockerCompose)) { exit 1 }
    Check-EnvFile
    
    Write-Host "Building images..." -ForegroundColor Yellow
    & $DockerCompose build
    
    Write-Host "Starting containers..." -ForegroundColor Yellow
    & $DockerCompose --env-file $EnvFile up -d
    
    Write-Success "Services started successfully"
    
    Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Header "Access Points"
    Write-Host "User App:    http://3.110.33.131:3000" -ForegroundColor Blue
    Write-Host "Admin App:   http://3.110.33.131:3001" -ForegroundColor Blue
    Write-Host "Backend API: http://3.110.33.131:5000/api" -ForegroundColor Blue
    Write-Host "Health:      http://3.110.33.131:5000/api/health" -ForegroundColor Blue
    Write-Host ""
}

# Stop services
function Stop-Services {
    Write-Header "Stopping Services"
    & $DockerCompose down
    Write-Success "Services stopped"
}

# Restart services
function Restart-Services {
    Write-Header "Restarting Services"
    & $DockerCompose restart
    Write-Success "Services restarted"
}

# Show logs
function Show-Logs {
    Write-Header "Showing Logs (Press Ctrl+C to exit)"
    & $DockerCompose logs -f
}

# Build images
function Build-Images {
    Write-Header "Building Docker Images"
    & $DockerCompose build --no-cache
    Write-Success "Build completed"
}

# Show status
function Show-Status {
    Write-Header "Service Status"
    & $DockerCompose ps
}

# Clean up
function Clean-All {
    Write-Header "Cleaning Up"
    $response = Read-Host "This will remove all containers and volumes. Continue? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        & $DockerCompose down -v
        Write-Success "Cleanup completed"
    }
    else {
        Write-Warning-Custom "Cleanup cancelled"
    }
}

# Rebuild everything
function Rebuild-All {
    Write-Header "Rebuilding Everything from Scratch"
    $response = Read-Host "This will remove all containers, volumes, and images. Continue? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        & $DockerCompose down -v
        & $DockerCompose rm -f
        # Remove images
        $images = docker images -q 2>/dev/null
        if ($images) {
            docker rmi $images.Split([Environment]::NewLine) 2>/dev/null
        }
        Write-Success "Clean slate ready. Starting..."
        Start-Services
    }
    else {
        Write-Warning-Custom "Rebuild cancelled"
    }
}

# Show help
function Show-Help {
    Write-Host @"
Polytechnic SIS Docker Compose Manager

Usage:
  .\docker-start.ps1 [command]

Commands:
  start        - Build and start all services
  stop         - Stop all services
  restart      - Restart all services
  logs         - View logs from all services (Ctrl+C to exit)
  status       - Show status of all services
  build        - Build Docker images
  clean        - Remove containers and volumes
  rebuild      - Full rebuild from scratch
  help         - Show this help message

Examples:
  .\docker-start.ps1 start
  .\docker-start.ps1 logs
  .\docker-start.ps1 rebuild

Environment:
  - Uses .env.docker for configuration
  - Update IP addresses in .env.docker if needed
  - Backend: 3.110.33.131:5000
  - User App: 3.110.33.131:3000
  - Admin App: 3.110.33.131:3001

"@ -ForegroundColor Cyan
}

# Main execution
switch ($Command.ToLower()) {
    "start" {
        Start-Services
    }
    "stop" {
        Stop-Services
    }
    "restart" {
        Restart-Services
    }
    "logs" {
        Show-Logs
    }
    "status" {
        Show-Status
    }
    "build" {
        Build-Images
    }
    "clean" {
        Clean-All
    }
    "rebuild" {
        Rebuild-All
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error-Custom "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
