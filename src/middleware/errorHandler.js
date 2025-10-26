// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Knex/Database errors
  if (err.code === '23502') {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'Please provide all required fields'
    });
  }

  if (err.code === '22P02') {
    return res.status(400).json({
      error: 'Invalid data type',
      message: 'Please check your input data types'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
};

module.exports = {
  errorHandler,
  notFound
};