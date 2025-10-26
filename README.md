# TodoMaster Backend API

A robust Node.js/Express backend API for the TodoMaster task management application with Docker support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)
- Git

## 📦 Installation & Setup

### Local Development

```bash
# Clone the repository
git clone https://github.com/lahiruimesh/todo-backend.git
cd todo-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

The backend includes a complete `docker-compose.yml` that sets up both the backend and PostgreSQL database:

```bash
# Start the backend with database
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (database data)
docker-compose down -v
```

### Build Docker Image

```bash
# Build the image
docker build -t todomaster-backend:latest .

# Or use the build script
chmod +x build.sh
./build.sh single latest
```

### Run with Docker

```bash
# Run with environment variables
docker run -d \
  --name todomaster-backend \
  -p 5000:5000 \
  -e DB_HOST=your-db-host \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_NAME=todoapp \
  -e NODE_ENV=production \
  todomaster-backend:latest
```

### Docker Hub Image

```bash
# Pull from Docker Hub
docker pull lahiruimesh/todomasterbackend:v1.0.0

# Run the official image
docker run -d \
  --name todomaster-backend \
  -p 5000:5000 \
  -e DB_HOST=your-db-host \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_NAME=todoapp \
  lahiruimesh/todomasterbackend:v1.0.0
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `todoapp` |
| `DB_USER` | Database username | `todouser` |
| `DB_PASSWORD` | Database password | `required` |

### Example .env file

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USER=todouser
DB_PASSWORD=your_password_here
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Todos
- `GET /api/todos/pending` - Get last 5 pending todos
- `GET /api/todos` - Get all todos (with optional status filter)
- `GET /api/todos/:id` - Get specific todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete todo

### Example API Usage

```bash
# Get pending todos
curl http://localhost:5000/api/todos/pending

# Create a new todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "description": "Build and deploy containers"}'

# Toggle todo completion
curl -X PATCH http://localhost:5000/api/todos/1/toggle
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Build Scripts

The project includes automated build scripts:

```bash
# Build for current platform
./build.sh single [tag]

# Build for multiple platforms
./build.sh multi [tag]

# Run tests in Docker
./build.sh test

# Run all (test + build)
./build.sh all [tag]
```

## 📚 Features

- ✅ Full CRUD operations for todos
- ✅ PostgreSQL database with migrations
- ✅ Input validation and error handling  
- ✅ Filter todos by status (completed/pending)
- ✅ Show only last 5 pending tasks
- ✅ Comprehensive test suite with Jest
- ✅ Environment-based configuration
- ✅ CORS support for frontend integration
- ✅ Docker containerization
- ✅ Health check endpoints

## 1. Clone and Navigate

```bash
git clone <repository-url>
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

**Create PostgreSQL databases:**

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE todo_app;
CREATE DATABASE todo_app_test;

-- Optional: Create a dedicated user
CREATE USER todo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;
GRANT ALL PRIVILEGES ON DATABASE todo_app_test TO todo_user;
```

### 4. Environment Configuration

Copy and configure the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=todo_app
DB_TEST_NAME=todo_app_test

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 5. Run Database Migrations

```bash
npm run migrate
```

### 6. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
- **GET** `/health`
  - Returns server health status

#### Get All Todos
- **GET** `/api/todos`
  - Query Parameters:
    - `status` (optional): `completed` | `pending`
  - Returns: List of todos

#### Get Todo by ID
- **GET** `/api/todos/:id`
  - Returns: Single todo object

#### Create New Todo
- **POST** `/api/todos`
  - Body:
    ```json
    {
      "title": "string (required, max 255 chars)",
      "description": "string (optional)",
      "completed": "boolean (optional, default: false)"
    }
    ```

#### Update Todo
- **PUT** `/api/todos/:id`
  - Body (at least one field required):
    ```json
    {
      "title": "string (optional, max 255 chars)",
      "description": "string (optional)",
      "completed": "boolean (optional)"
    }
    ```

#### Delete Todo
- **DELETE** `/api/todos/:id`
  - Returns: Success confirmation

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* todo object or array */ },
  "message": "Success message (for create/update/delete)",
  "count": 5 // (for list endpoints)
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## Example API Calls

### Using curl

**Create a todo:**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Node.js",
    "description": "Complete the Node.js tutorial",
    "completed": false
  }'
```

**Get all todos:**
```bash
curl http://localhost:3000/api/todos
```

**Get completed todos only:**
```bash
curl http://localhost:3000/api/todos?status=completed
```

**Update a todo:**
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a todo:**
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Test Database Setup
Tests automatically use a separate test database (`todo_app_test`) and run migrations before testing.

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run test suite
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration

### Project Structure

```
Backend/
├── src/
│   ├── models/
│   │   └── Todo.js           # Todo model with database operations
│   ├── routes/
│   │   └── todos.js          # Todo API routes
│   ├── middleware/
│   │   ├── errorHandler.js   # Error handling middleware
│   │   └── validation.js     # Input validation middleware
│   ├── db.js                 # Database connection
│   └── server.js             # Express server setup
├── migrations/
│   └── *_create_todos_table.js
├── tests/
│   ├── setup.js              # Test configuration
│   └── todos.test.js         # API endpoint tests
├── .env                      # Environment variables
├── .gitignore
├── jest.config.js            # Jest configuration
├── knexfile.js               # Database configuration
├── package.json
└── README.md
```

## Database Schema

### Todos Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| completed | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

## Error Handling

The API includes comprehensive error handling for:

- **Validation errors** (400) - Invalid input data
- **Not found errors** (404) - Resource doesn't exist
- **Database errors** (400/500) - Database constraint violations
- **Server errors** (500) - Internal server errors

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3000
```

### Heroku Deployment

1. Add PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

2. Set environment variables:
```bash
heroku config:set NODE_ENV=production
```

3. Deploy and run migrations:
```bash
git push heroku main
heroku run npm run migrate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues:

1. Check that PostgreSQL is running
2. Verify database credentials in `.env`
3. Ensure migrations have been run
4. Check the server logs for detailed error messages

For additional help, please open an issue in the repository.