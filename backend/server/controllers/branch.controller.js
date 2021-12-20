import httpStatus from 'http-status';
import moment from 'moment-timezone';
import async from 'async';
import appSettings from '../../appSettings';
import Response from '../services/response.service';
import Branch from '../models/branch.model';
import Customer from '../models/customer.model';

/**
 * Get branch.
 * @returns {branch}
 */
function get(req, res) {
  const branch = req.branch;
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    getCustomerFromUser
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (branch.customer.toString() === result._id.toString()) {
      res.json(Response.success(branch));
    } else {
      res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
    }
  });
}

/**
 * Get role list.
 * @returns {branch[]}
 */
function list(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    getCustomerFromUser
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else {
      let filter = { customer: result, status: 'Active' };

      if (result.type === 'Staff') {
        filter = { manager: result._id };
      }

      Branch.find(filter)
        .where('status').equals('Active')
        .sort({
          createdAt: -1
        }).then((branches) => {
          res.json(Response.success(branches));
        });
    }
  });
}

/**
 * Create order from recurring order
 * @returns {branch}
 */
function create(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    getCustomerFromUser
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else {
      const branch = new Branch({
        branchName: req.body.branchName,
        customer: result._id,
        location: req.body.location,
        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
        manager: req.body.manager._id
      });
      branch.save()
        .then(savedBranch => res.json(Response.success(savedBranch)))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
    }
  });
}


/**
 * Update a branch
 */
function update(req, res) {
  const branch = req.branch;
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    getCustomerFromUser
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (branch.customer.toString() === result._id.toString()) {
      branch.branchName = req.body.branchName;
      branch.location = req.body.location;
      if (req.body.manager) {
        branch.manager = req.body.manager._id;
      }
      branch.status = req.body.status;
      if (req.body.status === 'Blocked') {
        branch.status = 'InActive';
      }
      branch.save()
        .then(savedBranch => res.json(Response.success(savedBranch)))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    } else {
      res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
    }
  });
}

/**
 * Delete branch.
 * @returns {branch}
 */
function remove(req, res) {
  const branch = req.branch;
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    getCustomerFromUser
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (branch.customer.toString() === result._id.toString()) {
      branch.status = 'InActive';
      branch.save()
        .then(savedBranch => res.json(Response.success(savedBranch)))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    } else {
      res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
    }
  });
}

/**
 * Load.
 * @returns {branch}
 */
function load(req, res, next, id) {
  Branch.findById(id)
    .then((branch) => {
      if (branch) {
        req.branch = branch;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Helper Fucntions
 */
function getCustomerFromUser(user, callback) {
  Customer.findOne({ user })
    .then((customer) => {
      callback(null, customer);
    });
}

/**
 * Get branches list.
 * @returns {branch[]}
 */
function listBranches(req, res) {
  const offset = req.params.offset ? parseInt(req.params.offset) : 0,
    limit = req.params.limit ? parseInt(req.params.limit) : 0,
    searchText = req.query.searchText ? req.query.searchText.trim() : '',
    status = req.query.status && req.query.status !== 'All' ? req.query.status.trim() : '';

  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    getCustomerFromUser
  ], (err, result) => {
    const isStaff = result.type === 'Staff';

    let filter = { customer: result };

    if (isStaff) {
      filter = { customer: result.customer };
    }

    if (searchText) {
      const searchRegex = new RegExp(searchText);
      filter.$or = [{ branchName: searchRegex }, { 'location.city': searchRegex }, { 'location.address': searchRegex }];
    }

    if (status) {
      filter.status = status;
    }

    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else {
      const response = {
        branches: [],
        count: 0
      };

      Branch.find(filter)
        .limit(limit)
        .skip(offset)
        .sort({
          createdAt: -1
        }).populate({
          path: 'manager',
          model: 'Customer',
          select: '_id representativeName'
        })
        .then((branches) => {
          response.branches = branches;
          return Branch.count(filter);
        }).then((branchesCount) => {
          response.count = branchesCount;
          if (!isStaff) {
            return Customer.find({ customer: result._id, type: 'Staff' }, {
              _id: 1,
              representativeName: 1
            });
          }
          return null;
        }).then((customers) => {
          response.staff = customers;
          response.isStaff = isStaff;
          res.json(Response.success(response));
        });
    }
  });
}

/**
 * Get customer branches list.
 * @returns {branch[]}
 */
function listCustomerBranches(req, res) {
  const offset = req.params.offset ? parseInt(req.params.offset) : 0,
    limit = req.params.limit ? parseInt(req.params.limit) : 0,
    customerId = req.params.customerId;


  if (customerId == 'All') {
    res.json(Response.success({
      branches: [],
      count: 0
    }));
    return;
  }

  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    }
  ], (err, result) => {
    const filter = { customer: customerId };

    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else {
      const response = {
        branches: [],
        count: 0
      };

      Branch.find(filter)
        .limit(limit)
        .skip(offset)
        .sort({
          createdAt: -1
        }).populate({
          path: 'manager',
          model: 'Customer',
          select: '_id representativeName'
        })
        .then((branches) => {
          response.branches = branches;
          return Branch.count(filter);
        }).then((branchesCount) => {
          response.count = branchesCount;

          return Customer.find({ customer: result._id, type: 'Staff' }, {
            _id: 1,
            representativeName: 1
          });
        }).then((customers) => {
          response.staff = customers;
          res.json(Response.success(response));
        });
    }
  });
}


export default {
  load,
  get,
  list,
  create,
  update,
  remove,
  listBranches,
  listCustomerBranches
};

