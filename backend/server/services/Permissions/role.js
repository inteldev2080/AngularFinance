const Permission = require('./permission');

const roles = (role, req, res, next) => {
  switch (role) {
    case 'Admin':
      new Permission(req, res)
        .isAdmin()
        .done();
      break;

    // TODO: Add a handler if the role does not exist
    default:
      throw ('Role doesnt exits'); // eslint-disable-line no-throw-literal
  }
};


module.exports = roles;
