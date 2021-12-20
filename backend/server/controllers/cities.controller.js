import httpStatus from 'http-status';
import Response from '../services/response.service';
import Cities from '../models/cities.model';

/**
 * Get Cities.
 * @returns {Cities}
 */
function get(req, res) {
  const city = req.city;
  res.json(Response.success(city));
}

/**
 * Get city list.
 * @returns {Cities[]}
 */
function list(req, res) {
  Cities.find()
    .where('status').equals('Active')
    .then((cities) => {
      res.json(Response.success(cities));
    });
}

/**
 * Create city with lat long
 * @returns {City}
 */
function create(req, res) {
  const city = new Cities({
    englishName: req.body.englishName,
    arabicName: req.body.arabicName || '',
    coordinates: req.body.coordinates,
    address: req.body.address
  });
  city.save()
    .then((savedCity) => {
      res.json(Response.success(savedCity));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
}

/**
 * Update a city
 */
function update(req, res) {
  const city = req.city;
  city.englishName = req.body.englishName;
  city.arabicName = req.body.arabicName;
  city.coordinates = req.body.coordinates;
  city.city = req.body.city;
  city.status = req.body.status;
  city.save()
    .then(savedCity => res.json(Response.success(savedCity)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Delete City.
 * @returns {City}
 */
function remove(req, res) {
  const city = req.city;

  city.status = 'Archive';

  city.save()
    .then(savedCity => res.json(Response.success(savedCity)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Load.
 * @returns {City}
 */
function load(req, res, next, id) {
  Cities.findById(id)
    .then((city) => {
      if (city) {
        req.city = city;
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
  remove
};

