const swaggerDocument = {
  swagger: '2.0',
  info: {
    version: 'V0.2',
    title: 'Ejar API'
  },
  basePath: '/',

  paths: {
    '/api/city/all': {
      get: {
        tags: [
          'CityAPI'
        ],
        operationId: 'ApiCityAllGet',
        consumes: [

        ],
        produces: [

        ],
        responses: {
          200: {
            description: 'Success'
          }
        }
      }
    },
    '/api/city': {
      get: {
        tags: [
          'CityAPI'
        ],
        operationId: 'ApiCityGet',
        consumes: [

        ],
        produces: [

        ],
        parameters: [
          {
            name: 'skip',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32'
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32'
          }
        ],
        responses: {
          200: {
            description: 'Success'
          }
        }
      }
    }
  },
  definitions: {

  },
  securityDefinitions: {

  }
};

module.exports = swaggerDocument;
