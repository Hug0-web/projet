const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
      openapi: '3.0.0',
      info: {
            title: 'MyContacts',
            version: '1.0.0'
      },
      components: {
        securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
        }
    }
    }

const options = {
    swaggerDefinition,
    apis: ['./Model/ModelSwagger.js', './Controller/ContactController.js', './Controller/UserController.js' ],
}

const docSwag = swaggerJSDoc(options);

module.exports = docSwag;