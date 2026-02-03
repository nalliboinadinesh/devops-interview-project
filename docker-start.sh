#!/bin/bash
# Docker Compose Quick Start Script for Polytechnic SIS
# Usage: ./docker-start.sh [command]
# Commands: start, stop, restart, logs, build, clean, rebuild

set -e

DOCKER_COMPOSE="docker-compose"
ENV_FILE=".env.docker"
COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker."
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Check if .env.docker exists
check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        print_warning ".env.docker not found. Creating from template..."
        # If template exists, copy it
        if [ -f ".env.docker.example" ]; then
            cp .env.docker.example .env.docker
            print_success ".env.docker created from template"
        else
            print_error ".env.docker not found and no template available"
            exit 1
        fi
    fi
}

# Start services
start_services() {
    print_header "Starting Polytechnic SIS Services"
    check_docker
    check_docker_compose
    check_env_file
    
    echo "Building images..."
    $DOCKER_COMPOSE build
    
    echo "Starting containers..."
    $DOCKER_COMPOSE --env-file $ENV_FILE up -d
    
    print_success "Services started successfully"
    
    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 5
    
    echo ""
    print_header "Access Points"
    echo -e "User App:    ${BLUE}http://3.110.33.131:3000${NC}"
    echo -e "Admin App:   ${BLUE}http://3.110.33.131:3001${NC}"
    echo -e "Backend API: ${BLUE}http://3.110.33.131:5000/api${NC}"
    echo -e "Health:      ${BLUE}http://3.110.33.131:5000/api/health${NC}"
    echo ""
}

# Stop services
stop_services() {
    print_header "Stopping Services"
    $DOCKER_COMPOSE down
    print_success "Services stopped"
}

# Restart services
restart_services() {
    print_header "Restarting Services"
    $DOCKER_COMPOSE restart
    print_success "Services restarted"
}

# Show logs
show_logs() {
    print_header "Showing Logs (Press Ctrl+C to exit)"
    $DOCKER_COMPOSE logs -f
}

# Build images
build_images() {
    print_header "Building Docker Images"
    $DOCKER_COMPOSE build --no-cache
    print_success "Build completed"
}

# Clean up (remove containers and volumes)
clean_all() {
    print_header "Cleaning Up"
    read -p "This will remove all containers and volumes. Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        $DOCKER_COMPOSE down -v
        print_success "Cleanup completed"
    else
        print_warning "Cleanup cancelled"
    fi
}

# Rebuild everything from scratch
rebuild_all() {
    print_header "Rebuilding Everything from Scratch"
    read -p "This will remove all containers, volumes, and images. Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        $DOCKER_COMPOSE down -v
        $DOCKER_COMPOSE rm -f
        docker rmi $(docker images -q 2>/dev/null) 2>/dev/null || true
        print_success "Clean slate ready. Starting..."
        start_services
    else
        print_warning "Rebuild cancelled"
    fi
}

# Status
show_status() {
    print_header "Service Status"
    $DOCKER_COMPOSE ps
}

# Show help
show_help() {
    cat << EOF
${BLUE}Polytechnic SIS Docker Compose Manager${NC}

${YELLOW}Usage:${NC}
  ./docker-start.sh [command]

${YELLOW}Commands:${NC}
  start        - Build and start all services
  stop         - Stop all services
  restart      - Restart all services
  logs         - View logs from all services (Ctrl+C to exit)
  status       - Show status of all services
  build        - Build Docker images
  clean        - Remove containers and volumes
  rebuild      - Full rebuild from scratch
  help         - Show this help message

${YELLOW}Examples:${NC}
  ./docker-start.sh start
  ./docker-start.sh logs
  ./docker-start.sh rebuild

${YELLOW}Environment:${NC}
  - Uses .env.docker for configuration
  - Update IP addresses in .env.docker if needed
  - Backend: 3.110.33.131:5000
  - User App: 3.110.33.131:3000
  - Admin App: 3.110.33.131:3001

EOF
}

# Main
main() {
    case "${1:-start}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            show_logs
            ;;
        status)
            show_status
            ;;
        build)
            build_images
            ;;
        clean)
            clean_all
            ;;
        rebuild)
            rebuild_all
            ;;
        help)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
