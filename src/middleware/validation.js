// Validation middleware for todos
const validateTodo = (req, res, next) => {
  const { title } = req.body;

  // Check if title is provided and is a string
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Title is required and must be a non-empty string'
    });
  }

  // Check title length
  if (title.length > 255) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Title must be less than 255 characters'
    });
  }

  // Validate description if provided
  if (req.body.description !== undefined && typeof req.body.description !== 'string') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Description must be a string'
    });
  }

  // Validate completed if provided
  if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Completed must be a boolean'
    });
  }

  // Sanitize input
  req.body.title = title.trim();
  if (req.body.description) {
    req.body.description = req.body.description.trim();
  }

  next();
};

// Validation for todo updates (allows partial updates)
const validateTodoUpdate = (req, res, next) => {
  const { title, description, completed } = req.body;

  // At least one field must be provided
  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'At least one field (title, description, or completed) must be provided'
    });
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title must be a non-empty string'
      });
    }
    if (title.length > 255) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title must be less than 255 characters'
      });
    }
    req.body.title = title.trim();
  }

  // Validate description if provided
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Description must be a string'
    });
  }

  // Validate completed if provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Completed must be a boolean'
    });
  }

  // Sanitize description
  if (req.body.description) {
    req.body.description = req.body.description.trim();
  }

  next();
};

// Validate ID parameter
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid ID parameter'
    });
  }

  req.params.id = parseInt(id);
  next();
};

module.exports = {
  validateTodo,
  validateTodoUpdate,
  validateId
};