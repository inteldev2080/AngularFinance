import httpStatus from 'http-status';
import async from 'async';
import Role from '../models/role.model';
import Permission from '../models/permission.model';
import Response from '../services/response.service';
import Supplier from '../models/supplier.model';
import User from '../models/user.model';
import Customer from '../models/customer.model';

/**
 * Get role list.
 * @returns {Role[]}
 */
function list(req, res) {
  // Check if the user is an admin.
  if (req.user.type === 'Admin') {
    if (!req.query.all) {
      Role.find({ $and: [{ isLocked: { $ne: (true) } }, { isDeleted: false }, { _id: { $ne: req.user.role } }] })
        .where('userType').equals('Admin')
        .skip(Number(req.query.skip))
        .limit(Number(req.query.limit))
        .then((roles) => {
          Role.find({ isLocked: { $ne: (true) } })
            .where('userType').equals('Admin')
            .then((roleCount) => {
              const rolesObject = {
                roles,
                count: roleCount.length
              };
              res.json(Response.success(rolesObject));
            });
        })
        .catch(e => res.json(Response.failure(e)));
    } else {
      Role.find({ $and: [{ isLocked: { $ne: (true) } }, { isDeleted: false }, { _id: { $ne: req.user.role } }] })
        .skip(Number(req.query.skip))
        .limit(Number(req.query.limit))
        .then((roles) => {
          Role.find({ isLocked: { $ne: (true) } })
            .then((roleCount) => {
              const rolesObject = {
                roles,
                count: roleCount.length
              };
              res.json(Response.success(rolesObject));
            });
        })
        .catch(e => res.json(Response.failure(e)));
    }
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
      (err, supplierId) => {
        Role.find({ $and: [{ userType: 'Supplier' }, { englishName: { $ne: 'Supplier Admin' } }, { isLocked: { $ne: (true) } }, { supplier: supplierId }, { isDeleted: false }, { _id: { $ne: req.user.role } }] })
          .select({ _id: 1, userType: 1, englishName: 1, arabicName: 1, permissions: 1 })
          .skip(Number(req.query.skip))
          .limit(Number(req.query.limit))
          .then((roles) => {
            Role.find({ $and: [{ userType: 'Supplier' }, { englishName: { $ne: 'Supplier Admin' } }, { isLocked: { $ne: (true) } }, { supplier: supplierId }, { isDeleted: false }, { _id: { $ne: req.user.role } }] })
              .where('userType').equals('Supplier')
              .then((roleCount) => {
                const rolesObject = {
                  roles,
                  count: roleCount.length
                };
                res.json(Response.success(rolesObject));
              });
          })
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      });
  } else {
    let blockRolesAdd = false;
    async.waterfall([
      function passParameters(callback) {
        Customer.findOne({ user: req.user._id }).populate('user').lean().then((customer) => {
          if (customer.type === 'Staff') {
            blockRolesAdd = true;
            return Customer.findOne({ _id: customer.customer }).populate('user').lean();
          }
          return customer;
        }).then((customer) => {
          callback(null, customer);
        });
      },
    ],
      (err, customer) => {
        Role.find({ $and: [{ userType: 'Customer' }, { englishName: { $nin: ['Customer Admin', 'Customer'] } }, { isLocked: { $ne: (true) } }, { customer : customer._id }, { isDeleted: false }, { _id: { $ne: customer.user.role } }] })
          .select({ _id: 1, userType: 1, englishName: 1, arabicName: 1, permissions: 1 })
          .then((rolesArr) => {
            const roles = rolesArr.slice(req.query.skip, (req.query.limit + req.query.skip) > rolesArr.length ? (rolesArr.length) // eslint-disable-line max-len
              : (req.query.limit + req.query.skip));
            const rolesObject = {
              roles,
              count: rolesArr.length,
              blockRolesAdd
            };
            res.json(Response.success(rolesObject));
          });
      });
  }
}

/**
 * Create order from recurring order
 * @param {String} req.body.arabicName
 * @param {String} req.body.englishName
 * @param {ObjectId []} req.body.permissions
 * @returns {Role}
 */
function create(req, res) {
  // Check if the user is an admin.
  if (req.user.type === 'Admin') {
    const role = new Role({
      userType: 'Admin',
      permissions: req.body.permissions,
      arabicName: req.body.arabicName,
      englishName: req.body.englishName
    });

    role.save()
      .then(savedRole => res.json(Response.success(savedRole)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
      (err, supplierId) => {
        const role = new Role({
          userType: 'Supplier',
          supplier: supplierId,
          permissions: req.body.permissions,
          arabicName: req.body.arabicName,
          englishName: req.body.englishName
        });

        role.save()
          .then(savedRole => res.json(Response.success(savedRole)))
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      });
  } else {
    async.waterfall([
      function passParameters(callback) {
        Customer.findOne({ user: req.user._id })
            .then((customer) => {
              callback(null, customer);
            });
      }
    ],
      (err, customer) => {
        const role = new Role({
          userType: 'Customer',
          customer,
          permissions: req.body.permissions,
          arabicName: req.body.arabicName,
          englishName: req.body.englishName
        });

        role.save()
          .then(savedRole => res.json(Response.success(savedRole)))
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      });
  }
}

/**
 * Update a role
 */
function update(req, res) {
  const role = req.role;
  // Check if the user is an admin.
  if (role.userType === 'Admin' && req.user.type === 'Admin') {
    role.permissions = req.body.permissions;
    role.arabicName = req.body.arabicName;
    role.englishName = req.body.englishName;

    role.save()
      .then(savedRole => res.json(Response.success(savedRole)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        User.findById(req.user._id)
          .then((user) => {
            Supplier.findOne({ staff: { $in: ([user._id]) } })
              .then((supplier) => {
                callback(null, supplier);
              });
          });
      }
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        Supplier.find({ staff: { $in: ([req.user._id]) } })
          .populate({
            path: 'staff',
            select: 'role',
            populate: {
              path: 'role',
              match: { supplier: result }
            }
            // match: { role: role._id }
          })
          .select('staff')
          .then((supplier) => {
            const staffArr = supplier[0].staff;
            if (staffArr.length > 0) {
              role.permissions = req.body.permissions;
              role.arabicName = req.body.arabicName;
              role.englishName = req.body.englishName;

              role.save()
                .then(savedRole => res.json(Response.success(savedRole)))
                .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
            } else {
              res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
            }
          });
      }
    });
  } else {
    async.waterfall([
      function passParameter(callback) {
        User.findById(req.user._id)
          .then((user) => {
            Customer.findOne({ user: { $in: ([user._id]) } })
              .then((customer) => {
                callback(null, customer);
              });
          });
      }
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        Customer.findOne({ user: req.user._id })
          .populate({
            path: 'user',
            select: 'role',
            populate: {
              path: 'role',
              match: { customer: result }
            }
          })
          .then((customer) => {
            if (customer._id.toString() === role.customer.toString()) {
              role.permissions = req.body.permissions;
              role.arabicName = req.body.arabicName;
              role.englishName = req.body.englishName;

              role.save()
                .then(savedRole => res.json(Response.success(savedRole)))
                .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
            } else {
              res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
            }
          });
      }
    });
  }
}

/**
 * Delete Role.
 * @returns {Role}
 */
function remove(req, res) {
  const role = req.role;
  // Check if the user is an admin.
  if (role.userType === 'Admin') {
    // Check if the role has any users before removing it.
    User.find()
      .where('role').equals(role._id)
      .then((users) => {
        if (users.length > 0) {
          users.forEach((userObj) => {
            userObj.role = req.body.alternativeRoleId;
            userObj.save();
          });
          role.isDeleted = true;
          role.save()
            .then(savedRole => res.json(Response.success(savedRole)))
            .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
          // res.status(httpStatus.BAD_REQUEST).json(Response.failure(11));
        } else {
          role.isDeleted = true;
          role.save()
            .then(savedRole => res.json(Response.success(savedRole)))
            .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
          // role.remove();
          // res.json(Response.success(role));
        }
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
      (err, supplierId) => {
        // Check if the role has any users before removing it.
        Supplier.findOne({ _id: supplierId })
          .populate({
            path: 'staff',
            select: '_id role',
            populate: {
              path: 'role',
              match: { supplier: supplierId }
            }
            // match: { role: role._id }
          })
          .then((supplierStaff) => {
            const staffArr = supplierStaff.staff;
            const Ids = staffArr.map(c => c._id.toString());
            User.find({ $and: [{ role: role._id }, { _id: { $in: Ids } }] })
              .then((users) => {
                if (users.length > 0) {
                  users.forEach((userObj) => {
                    userObj.role = req.body.alternativeRoleId;
                    userObj.save();
                  });
                  role.isDeleted = true;
                  role.save()
                    .then(savedRole => res.json(Response.success(savedRole)))
                    .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
                  // res.json(Response.success(users));
                  // res.status(httpStatus.BAD_REQUEST).json(Response.failure(11));
                } else if (role.supplier.toString() === supplierStaff._id.toString()) {
                  role.isDeleted = true;
                  role.save()
                    .then(savedRole => res.json(Response.success(savedRole)))
                    .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
                } else {
                  // role.remove();
                  // res.json(Response.success(role));
                  res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
                }
              });
          });
      });
  } else {
    async.waterfall([
      function passParameters(callback) {
        Customer.findOne({ user: req.user._id })
            .then((customer) => {
              callback(null, customer);
            });
      }
    ],
      (err, customer) => {
        Customer.findOne({ _id: customer._id })
          .populate({
            path: 'staff',
            select: '_id role',
            populate: {
              path: 'role',
              match: { customer }
            }
            // match: { role: role._id }
          })
          .then((customerStaff) => {
            const staffArr = customerStaff.staff;
            if (staffArr.length > 0) {
              const Ids = staffArr.map(c => c._id.toString());
              User.find({ $and: [{ role: role._id }, { _id: { $in: Ids } }] })
                .then((users) => {
                  if (users.length > 0) {
                    users.forEach((userObj) => {
                      userObj.role = req.body.alternativeRoleId;
                      userObj.save();
                    });
                    role.isDeleted = true;
                    role.save()
                      .then(savedRole => res.json(Response.success(savedRole)))
                      .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
                  } else if (role.customer.toString() === customer._id.toString()) {
                    role.isDeleted = true;
                    role.save()
                      .then(savedRole => res.json(Response.success(savedRole)))
                      .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
                  } else {
                    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
                  }
                });
            } else {
              role.isDeleted = true;
              role.save()
                .then(savedRole => res.json(Response.success(savedRole)))
                .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
            }
          });
      });
  }
}

/**
 * Get permission list.
 * @returns {Permission[]}
 */
function getPermissions(req, res) {
  // Check if the user is a supplier
  if (req.user.type === 'Admin') {
    Permission.find()
      .select('-allowedEndPoints -type')
      .where('type').equals('Admin')
      .then(permissions => res.json(Response.success(permissions)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Supplier') {
    Permission.find({ key: { $ne: 'manageOrderDelivery' } })
      .select('-allowedEndPoints -type')
      .where('type').equals('Supplier')
      .then(permissions => res.json(Response.success(permissions)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Customer') {
    Customer.find({ user: req.user._id }).then((customer) => {
      Permission.find({ key: { $ne: 'manageCustomers' } })
        .select('-allowedEndPoints -type')
        .where('type').equals('Customer')
        .then((permissions) => {
          res.json(Response.success(permissions));
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    });
  }
}

/**
 * Load recurring order and append to req.
 */
function load(req, res, next, id) {
  Role.findById(id)
    .then((role) => {
      if (role) {
        req.role = role;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Helper Function
 * Get supplier using the user is.
 * @property {string} userId - The id of the supplier user.
 * @property {string} customerEmail - The email of the customer to be invited
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, callback) {
  Supplier.findOne()
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier._id));
}


export default {
  list,
  create,
  update,
  remove,
  load,
  getPermissions
};
