const Emitter = require('events');

const emitter = new Emitter();
const activities = require('./activity');
const roles = require('./role');


emitter.on('Authorization By Activity Request', activities);

emitter.on('Authorization By Role Request', roles);


module.exports = {
  can(activity, route) {
    return (req, res, next) => emitter.emit('Authorization By Activity Request', activity, route, req, res, next);
  },
  is(role) {
    return (req, res, next) => emitter.emit('Authorization By Role Request', role, req, res, next);
  }
};
