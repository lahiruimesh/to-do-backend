const express = require('express');
const Todo = require('../models/Todo');
const { validateTodo, validateTodoUpdate, validateId } = require('../middleware/validation');

const router = express.Router();

// GET /api/todos - Get all todos
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let todos;

    if (status === 'completed') {
      todos = await Todo.findCompleted();
    } else if (status === 'pending') {
      todos = await Todo.findPending();
    } else {
      todos = await Todo.findAll();
    }

    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/todos/:id - Get todo by ID
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: `Todo with ID ${req.params.id} does not exist`
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/todos - Create new todo
router.post('/', validateTodo, async (req, res, next) => {
  try {
    const { title, description, completed = false } = req.body;
    
    const todoData = {
      title,
      description: description || null,
      completed
    };

    const newTodo = await Todo.create(todoData);
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/todos/:id - Update todo by ID
router.put('/:id', validateId, validateTodoUpdate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if todo exists
    const existingTodo = await Todo.findById(id);
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: `Todo with ID ${id} does not exist`
      });
    }

    // Update todo
    const updatedTodo = await Todo.update(id, req.body);
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/todos/:id - Delete todo by ID
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if todo exists
    const existingTodo = await Todo.findById(id);
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: `Todo with ID ${id} does not exist`
      });
    }

    // Delete todo
    await Todo.delete(id);
    
    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;