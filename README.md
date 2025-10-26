# Todo App Backend

A RESTful API backend for a Todo application built with Node.js, Express, PostgreSQL, and Knex.js.

## Features

- ✅ Full CRUD operations for todos
- ✅ PostgreSQL database with migrations
- ✅ Input validation and error handling
- ✅ Filter todos by status (completed/pending)
- ✅ Comprehensive test suite with Jest
- ✅ Environment-based configuration
- ✅ CORS support for frontend integration

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Quick Start

### 1. Clone and Navigate

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