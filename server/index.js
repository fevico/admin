require('express-async-errors');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const uuid = require('uuid');
const config = require('../config/appconfig');
const Logger = require('../utils/logger.js');
const errorHandler = require('../middleware/error');

const logger = new Logger();
const app = express();

app.set('config', config);

// CORS configuration: Allow all origins
// app.use(
//   cors({
//     origin: '*', // Allow all origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//     credentials: true, // Support cookies, Authorization headers
//     maxAge: 86400, // Cache preflight for 24 hours
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);

      // Whitelist your frontend origins
      const allowedOrigins = [
        'http://localhost:5173', // Local frontend
        'https://your-frontend-url.com', // Production frontend
        // Add other origins as needed
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, origin); // Reflect the requesting origin
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400,
  })
);

app.use(bodyParser.json());
app.use(require('method-override')());
app.use(compression());

const swagger = require('../utils/swagger');

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// Mount API routes
app.use('/api/v1', require('../router/api')); // Mount directly to /api/v1

// Swagger docs
app.set('db', require('../models/index.js'));
app.set('port', process.env.DEV_APP_PORT || 2000);
app.use('/api/docs', swagger.router);

// Request logging middleware
app.use((req, res, next) => {
  req.identifier = uuid();
  const logString = `Request [${req.identifier}] ${req.method} ${req.url} ${req.headers['user-agent']} ${JSON.stringify(req.body)}`;
  logger.log(logString, 'info');
  next();
});

// 404 handler
app.use((req, res, next) => {
  try {
    logger.log(`404: ${req.url} not found`, 'error');
    const err = new Error('Not Found');
    err.status = 404;
    res.status(404).json({ type: 'error', message: 'The URL you are trying to reach is not hosted on our server' });
    next(err);
  } catch (error) {
    res.status(500).json({ type: 'error', message: 'Internal Server Error', error });
  }
});

app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
  logger.log('Stopping the server', 'info');
  process.exit();
});

module.exports = app;