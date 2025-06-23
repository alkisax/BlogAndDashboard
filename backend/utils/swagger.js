const m2s = require('mongoose-to-swagger');
const Image = require('../models/img.model')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "blog and dashboard",
      description: "basic dahshboard",
    },
    components: {
      schemas: {
        Image: m2s(Image)
      },
    },
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;