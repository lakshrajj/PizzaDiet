const cors = require('cors');

// CORS middleware for Vercel functions
const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app', 'https://your-custom-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Wrapper to run middleware in Vercel functions
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Error response helper
function errorResponse(res, statusCode, message, error = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
}

// Success response helper
function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
}

// Handle validation errors
function handleValidationError(error) {
  const errors = Object.keys(error.errors).reduce((acc, key) => {
    acc[key] = error.errors[key].message;
    return acc;
  }, {});
  
  return {
    message: 'Validation error',
    errors
  };
}

// Handle different HTTP methods in one function
async function handleRequest(req, res, handlers) {
  const method = req.method;
  
  if (handlers[method]) {
    try {
      await handlers[method](req, res);
    } catch (error) {
      console.error(`Error in ${method} handler:`, error);
      errorResponse(res, 500, 'Internal server error', error.message);
    }
  } else {
    errorResponse(res, 405, `Method ${method} not allowed`);
  }
}

module.exports = {
  corsMiddleware,
  runMiddleware,
  errorResponse,
  successResponse,
  handleValidationError,
  handleRequest
};