import httpStatus from 'http-status';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import Response from '../services/response.service';
import Content from '../models/content.model';

/**
 * Get content.
 * @returns {content}
 */
function get(req, res) {
  const content = req.content;
  res.json(Response.success(content));
}

/**
 * Get role list.
 * @returns {content[]}
 */
function list(req, res) {
  Content.find()
    .sort({
      createdAt: -1
    })
    .then((contents) => {
      res.json(Response.success(contents));
    });
}

/**
 * Create order from recurring order
 * @returns {content}
 */
function create(req, res) {
  const content = new Content({
    user: req.body.user,
    title: {
      arabic: req.body.title.arabic,
      english: req.body.title.english
    },
    body: {
      arabic: req.body.body.arabic,
      english: req.body.body.english
    },
    status: req.body.status,
    key: req.body.key,
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
    updatedAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });
  content.save()
    .then(savedContent => res.json(Response.success(savedContent)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
}


/**
 * Update a content
 */
function update(req, res) {
  const content = req.content;
  content.user = req.body.user;
  content.title.arabic = req.body.title.arabic;
  content.title.english = req.body.title.english;
  content.body.arabic = req.body.body.arabic;
  content.body.english = req.body.body.english;
  content.status = req.body.status;
  content.key = req.body.key;
  content.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
  content.save()
    .then(savedContent => res.json(Response.success(savedContent)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Delete content.
 * @returns {content}
 */
function remove(req, res) {
  const content = req.content;
  content.remove()
    .then(deletedContent => res.json(Response.success(deletedContent)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Load.
 * @returns {content}
 */
function load(req, res, next, id) {
  Content.findOne({ key: id })
    .then((content) => {
      if (content) {
        req.content = content;
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

