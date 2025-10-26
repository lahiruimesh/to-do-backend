#!/bin/bash
# TodoMaster Backend - Docker Build Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="todomaster-backend"
DEFAULT_TAG="latest"
PLATFORMS="linux/amd64,linux/arm64"

print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  TodoMaster Backend - Docker Build Script${NC}"
    echo -e "${BLUE}================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Function to build single platform
build_single() {
    local tag=${1:-$DEFAULT_TAG}
    print_info "Building ${IMAGE_NAME}:${tag} for current platform..."
    
    docker build -t "${IMAGE_NAME}:${tag}" .
    
    if [ $? -eq 0 ]; then
        print_success "Built ${IMAGE_NAME}:${tag}"
        echo
        print_info "Image size:"
        docker images "${IMAGE_NAME}:${tag}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
        echo
        print_info "To run the container:"
        echo "docker run -d --name todo-backend -p 5000:5000 \\"
        echo "  -e DB_HOST=your-db-host \\"
        echo "  -e DB_USER=your-db-user \\"
        echo "  -e DB_PASSWORD=your-db-password \\"
        echo "  -e DB_NAME=todoapp \\"
        echo "  ${IMAGE_NAME}:${tag}"
    else
        print_error "Build failed!"
        exit 1
    fi
}

# Function to build multi-platform
build_multiplatform() {
    local tag=${1:-$DEFAULT_TAG}
    print_info "Building ${IMAGE_NAME}:${tag} for multiple platforms..."
    print_info "Platforms: ${PLATFORMS}"
    
    # Check if buildx is available
    if ! docker buildx version >/dev/null 2>&1; then
        print_error "Docker Buildx not available. Install Docker Buildx for multi-platform builds."
        exit 1
    fi
    
    # Create builder if it doesn't exist
    docker buildx create --name todobuilder --use 2>/dev/null || docker buildx use todobuilder
    
    docker buildx build \
        --platform "${PLATFORMS}" \
        -t "${IMAGE_NAME}:${tag}" \
        --push \
        .
    
    if [ $? -eq 0 ]; then
        print_success "Built and pushed ${IMAGE_NAME}:${tag} for multiple platforms"
        print_info "Platforms: ${PLATFORMS}"
    else
        print_error "Multi-platform build failed!"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    print_info "Running backend tests in Docker..."
    
    docker build -t "${IMAGE_NAME}:test" --target test .
    docker run --rm "${IMAGE_NAME}:test"
    
    if [ $? -eq 0 ]; then
        print_success "All tests passed!"
    else
        print_error "Tests failed!"
        exit 1
    fi
}

# Main script
print_header

case "${1:-single}" in
    "single")
        build_single "${2}"
        ;;
    "multi")
        build_multiplatform "${2}"
        ;;
    "test")
        run_tests
        ;;
    "all")
        run_tests
        build_single "${2}"
        ;;
    *)
        echo "Usage: $0 {single|multi|test|all} [tag]"
        echo
        echo "Commands:"
        echo "  single [tag]  - Build for current platform (default: latest)"
        echo "  multi [tag]   - Build for multiple platforms and push"
        echo "  test         - Run tests in Docker"
        echo "  all [tag]    - Run tests and build single platform"
        echo
        echo "Examples:"
        echo "  $0 single            # Build todomaster-backend:latest"
        echo "  $0 single v1.0.0     # Build todomaster-backend:v1.0.0"
        echo "  $0 multi v1.0.0      # Build multi-platform and push"
        echo "  $0 test              # Run tests"
        exit 1
        ;;
esac