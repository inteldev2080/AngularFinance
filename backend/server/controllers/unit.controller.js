import httpStatus from 'http-status';
import Response from '../services/response.service';
import Unit from '../models/unit.model';
import Product from '../models/product.model';

/**
 * Get Unit.
 * @returns {Unit}
 */
function get(req, res) {
  const unit = req.unit;
  res.json(Response.success(unit));
}

/**
 * Get role list.
 * @returns {Unit[]}
 */
function list(req, res) {
  Unit.find()
    .then((units) => {
      res.json(Response.success(units));
    });
}

/**
 * Create order from recurring order
 * @returns {Unit}
 */
function create(req, res) {
  const unit = new Unit({
    englishName: req.body.englishName,
    arabicName: req.body.arabicName
  });
  unit.save()
    .then(savedUnit => res.json(Response.success(savedUnit)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
}


/**
 * Update a unit
 */
function update(req, res) {
  const unit = req.unit;
  unit.englishName = req.body.englishName;
  unit.arabicName = req.body.arabicName;
  unit.save()
    .then(savedUnit => res.json(Response.success(savedUnit)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Delete Unit.
 * @returns {Unit}
 */
function remove(req, res) {
  const unit = req.unit;
  Product.findOne({ unit: unit._id })
    .then((product) => {
      if (product) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(22)); // { message: 'Can't remove unit assigned to product' }
      } else {
        unit.remove()
          .then(deletedUnit => res.json(Response.success(deletedUnit)))
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      }
    });
}

/**
 * Load.
 * @returns {Unit}
 */
function load(req, res, next, id) {
  Unit.findById(id)
    .then((unit) => {
      if (unit) {
        req.unit = unit;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

export default {
  load,
  get,
  list,
  create,
  update,
  remove,
};

