# TodoMaster Backend - Docker Build Guide

## 🐳 Docker Build Process

### Prerequisites
- Docker Engine 20.10+
- Linux environment with Bash
- Git

### Build Commands

```bash
# Clone the backend repository
git clone <your-backend-repo-url>
cd todo-backend

# Build the Docker image
docker build -t todomaster-backend:latest .

# Or build with specific version tag
docker build -t todomaster-backend:v1.0.0 .
```

### Run Locally for Testing

```bash
# Start PostgreSQL (for local development)
docker run -d \
  --name todo-postgres \
  -e POSTGRES_DB=todoapp \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopassword \
  -p 5432:5432 \
  postgres:15-alpine

# Run backend container
docker run -d \
  --name todo-backend \
  -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=todoapp \
  -e DB_USER=todouser \
  -e DB_PASSWORD=todopassword \
  -e NODE_ENV=production \
  todomaster-backend:latest
```

### Environment Variables

Required environment variables:
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port (default: 5000)

### API Endpoints

Once running, the backend provides:
- Health check: `GET /health`
- Get pending todos: `GET /api/todos/pending`
- Create todo: `POST /api/todos`
- Update todo: `PUT /api/todos/:id`
- Delete todo: `DELETE /api/todos/:id`
- Toggle completion: `PATCH /api/todos/:id/toggle`

### Build for Different Platforms

```bash
# Build for multiple platforms (for sharing with clients)
docker buildx build --platform linux/amd64,linux/arm64 -t todomaster-backend:latest .

# Build for specific platform
docker build --platform linux/amd64 -t todomaster-backend:latest .
```