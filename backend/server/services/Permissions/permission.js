import APIError from '../../helpers/APIError';

const Permission = function (req, next) { // eslint-disable-line func-names
  this.req = req;
  this.params = req.params;
  this.next = next;
  this.result = true;
};

/** Admin Purpose Permissions. */
Permission.prototype.isAdmin = function () { // eslint-disable-line func-names
  this.result = this.req.user.type === 'Admin';
  return this;
};
Permission.prototype.isSupplier = function () { // eslint-disable-line func-names
  this.result = this.req.user.type === 'Supplier';
  return this;
};
Permission.prototype.isCustomer = function () { // eslint-disable-line func-names
  this.result = this.req.user.type === 'Customer';
  return this;
};
Permission.prototype.canAccess = function (route) { // eslint-disable-line func-names
  let flag = false;
  const allowedEndPoints = this.req.user.role.permissions.map(c => c.allowedEndPoints);
  for (let i = 0; i < allowedEndPoints.length; i += 1) {
    if (allowedEndPoints[i].indexOf(route) > -1) {
      flag = true;
      break;
    }
  }
  this.result = this.result && flag;
  return this;
};
Permission.prototype.isActive = function () { // eslint-disable-line func-names
  this.result = this.result &&
    this.req.user.status === 'Active';
  return this;
};

Permission.prototype.done = function () { // eslint-disable-line func-names
  this.result ? this.next() : this.next(new APIError('Unauthorized', 401));
};

module.exports = Permission;
