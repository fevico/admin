const { JsonWebTokenError } = require('jsonwebtoken');

// ErrorRequestHandler is a type, not needed at runtime in JS, so we omit it
const errorHandler = (error, req, res, next) => {
  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ error: error.message });
  }
  console.log(error);
  res.status(500).json({ error: error.message });
};

module.exports = errorHandler;