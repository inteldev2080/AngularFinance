export default {
  openapi: '3.0.1',
  info: {
    title: 'Supplies On API',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'local'
    },
    {
      url: 'https://supplieson.com/api',
      description: 'production'
    }
  ],
  tags: [],
  paths: {},
  securityDefinitions: {
    BasicAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  components: {
    responses: {
      400: {
        description: 'The arguments are not correct.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      409: {
        description: 'There is some conflict with the request.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      500: {
        description: 'Unknown error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number'
          },
          data: {
            type: 'object',
            properties: {
              message: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    securitySchemes: {
      APIKeyHeader: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};
