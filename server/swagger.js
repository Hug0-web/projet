const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
      openapi: '3.0.0',
      info: {
            title: 'MyContacts',
            version: '1.0.0'
      }
    }

const options = {
    swaggerDefinition,
    apis: [],
}

const docSwag = swaggerJSDoc(options);

module.exports = docSwag;