const express = require('express');
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const config = require('../config/appconfig');

const isProduction = process.env.NODE_ENV === 'production';

// Define directory and collect router files
const directoryPath = path.join(__dirname, '../router/api');
const pathes = [];

try {
  const files = fs.readdirSync(directoryPath);
  files.forEach(file => {
    if (file.endsWith('.js') && file !== 'index.js') {
      // Use path.join for consistent paths, relative to project root
      pathes.push(path.join('router/api', file));
    }
  });
} catch (err) {
  console.error(`Unable to scan directory: ${err}`);
}

// Log pathes to debug
console.log('Swagger API paths:', pathes);

const options = {
  swaggerDefinition: {
    info: {
      title: 'i Lrn',
      version: '1.0.0',
      description: 'i Lrn Microlearning System, REST API with Swagger doc',
      contact: {
        email: 'a.mezian@dreamtechs.co',
      },
    },
    tags: [
      {
        name: 'users',
        description: 'Users API',
      },
      {
        name: 'Auth',
        description: 'Authentication APIs',
      },
      {
        name: 'Email',
        description: 'For testing and sending emails',
      },
      {
        name: 'termsAndCondition',
        description: 'The terms and conditions for the application',
      },
      {
        name: 'Versioning',
        description: 'Operations related to checking the version of APIs or mobile apps',
      },
      {
        name: 'Service',
        description: 'Service-related operations (e.g., user counts, service providers)', // Added for serviceRouter
      },
    ],
    schemes: isProduction ? ['https'] : ['http'],
    host: isProduction ? 'app.admin.screwsandspanners.com' : `localhost:${config.app.port}`,
    basePath: '/api/v1',
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        description: 'JWT authorization of an API',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
  apis: pathes,
};

const swaggerSpec = swaggerJSDoc(options);
require('swagger-model-validator')(swaggerSpec);

router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function validateModel(name, model) {
  const responseValidation = swaggerSpec.validateModel(name, model, false, true);
  if (!responseValidation.valid) {
    throw new Error("Model doesn't match Swagger contract");
  }
}

module.exports = {
  router,
  validateModel,
};