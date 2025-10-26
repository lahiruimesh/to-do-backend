const request = require('supertest');
const app = require('../src/server');
const db = require('../src/db');

// Test database setup
beforeAll(async () => {
  // Run migrations
  await db.migrate.latest();
});

beforeEach(async () => {
  // Clean up database before each test
  await db('todos').truncate();
});

afterAll(async () => {
  // Close database connection
  await db.destroy();
});

describe('Todo API', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.message).toBe('Todo API Server');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return all todos', async () => {
      // Create test todos
      await db('todos').insert([
        { title: 'Test Todo 1', description: 'Description 1' },
        { title: 'Test Todo 2', completed: true }
      ]);

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it('should filter by status=completed', async () => {
      await db('todos').insert([
        { title: 'Pending Todo', completed: false },
        { title: 'Completed Todo', completed: true }
      ]);

      const response = await request(app)
        .get('/api/todos?status=completed')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'Todo description'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo created successfully');
      expect(response.body.data.title).toBe(todoData.title);
      expect(response.body.data.description).toBe(todoData.description);
      expect(response.body.data.completed).toBe(false);
    });

    it('should require title', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should not accept empty title', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '' })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should return todo by id', async () => {
      const [todo] = await db('todos')
        .insert({ title: 'Test Todo', description: 'Test Description' })
        .returning('*');

      const response = await request(app)
        .get(`/api/todos/${todo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(todo.id);
      expect(response.body.data.title).toBe(todo.title);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get('/api/todos/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .get('/api/todos/invalid')
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update todo', async () => {
      const [todo] = await db('todos')
        .insert({ title: 'Original Title', completed: false })
        .returning('*');

      const updateData = {
        title: 'Updated Title',
        completed: true
      };

      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/todos/999')
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require at least one field', async () => {
      const [todo] = await db('todos')
        .insert({ title: 'Test Todo' })
        .returning('*');

      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete todo', async () => {
      const [todo] = await db('todos')
        .insert({ title: 'Todo to delete' })
        .returning('*');

      const response = await request(app)
        .delete(`/api/todos/${todo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo deleted successfully');

      // Verify todo is deleted
      const deletedTodo = await db('todos').where('id', todo.id).first();
      expect(deletedTodo).toBeUndefined();
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete('/api/todos/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});