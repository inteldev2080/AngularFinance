import httpStatus from 'http-status';
import Response from '../services/response.service';
import SystemVariables from '../models/systemVariables.model';

/**
 * Get content.
 * @returns {content}
 */
function get(req, res) {
  const systemVariables = req.systemVariables;
  res.json(Response.success(systemVariables));
}

/**
 * Get role list.
 * @returns {content[]}
 */
function list(req, res) {
  SystemVariables.find()
    .then((variables) => {
      res.json(Response.success(variables));
    });
}

/**
 * Create order from recurring order
 * @returns {content}
 */
function create(req, res) {
  const systemVariables = new SystemVariables({
    key: req.body.key,
    title: req.body.title,
    value: req.body.value,
    order: req.body.order,
    group: req.body.group,
    isSerializable: req.body.isSerializable,
    isHidden: req.body.isHidden,
    type: req.body.type
  });
  systemVariables.save()
    .then(savedVariable => res.json(Response.success(savedVariable)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
}


/**
 * Update a content
 */
function update(req, res) {
  const variable = req.systemVariables;
  variable.key = req.body.key;
  variable.title = req.body.title;
  variable.value = req.body.value;
  variable.order = req.body.order;
  variable.group = req.body.group;
  variable.isSerializable = req.body.isSerializable;
  variable.isHidden = req.body.isHidden;
  variable.type = req.body.type;
  variable.save()
    .then(savedVariable => res.json(Response.success(savedVariable)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Delete content.
 * @returns {content}
 */
function remove(req, res) {
  const variable = req.systemVariables;
  variable.remove()
    .then(deletedVariable => res.json(Response.success(deletedVariable)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Load.
 * @returns {content}
 */
function load(req, res, next, id) {
  SystemVariables.findById(id)
    .then((systemVariables) => {
      if (systemVariables) {
        req.systemVariables = systemVariables;
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

