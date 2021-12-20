import httpStatus from 'http-status';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import Response from '../services/response.service';
import Contact from '../models/contact.model';
import EmailHandler from '../../config/emailHandler';
import UserService from '../services/user.service';
/**
 * Get contact.
 * @returns {contact}
 */
function get(req, res) {
  const contact = req.contact;
  res.json(Response.success(contact));
}

/**
 * Get role list.
 * @returns {contact[]}
 */
function list(req, res) {
  Contact.find()
    .sort({
      createdAt: -1
    })
    .then((contacts) => {
      const contactsArr = [];
      contacts.forEach((contactsObj) => {
        const contactObject = {
          _id: contactsObj._id,
          createdAt: contactsObj.createdAt,
          createdAtDay: moment(contactsObj.createdAt).format('YYYY-MM-DD'),
          createdAtMonth: moment(contactsObj.createdAt).format('YYYY-MM'),
          updatedAt: contactsObj.updatedAt,
          updatedAtDay: moment(contactsObj.updatedAt).format('YYYY-MM-DD'),
          updatedAtMonth: moment(contactsObj.updatedAt).format('YYYY-MM'),
          status: contactsObj.status,
          category: contactsObj.category,
          user: contactsObj.user,
          message: contactsObj.message,
          replies: contactsObj.replies,
          is_seen: contactsObj.is_seen
        };
        contactsArr.push(contactObject);
      });
      res.json(Response.success(contactsArr));
    });
}

/**
 * Create order from recurring order
 * @returns {contact}
 */
function create(req, res) {
  const contact = new Contact({
    user: {
      name: `${req.body.user.firstName} ${req.body.user.lastName}`,
      email: req.body.user.email,
      phone: req.body.user.mobileNumber
    },
    message: req.body.message,
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
    updatedAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });
  contact.save()
    .then(savedContact => res.json(Response.success(savedContact)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
}


/**
 * Update a contact
 */
function update(req, res) {
  const contact = req.contact;
  contact.status = req.body.status;
  contact.category = req.body.category;
  contact.user = req.body.user;
  contact.message = req.body.message;
  contact.is_seen = req.body.is_seen;
  contact.replies = req.body.replies;
  contact.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
  contact.save()
    .then(savedContact => res.json(Response.success(savedContact)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Update a contact
 */
function reply(req, res) {
  const contact = req.contact;

  contact.replies.push({
    user: req.body.user,
    reply: req.body.reply,
    language: req.body.language
  });
  if (appSettings.emailSwitch) {
    const content = {
      recipientName: UserService.toTitleCase(req.body.user),
      body: req.body.reply
    };
    // order.customer.user.email
    EmailHandler.sendEmail(req.body.user, content, 'EMAILREPLY', req.body.language);
  }
  contact.save()
    .then(savedContact => res.json(Response.success(savedContact)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Delete contact.
 * @returns {contact}
 */
function remove(req, res) {
  const contact = req.contact;
  contact.remove()
    .then(deletedContact => res.json(Response.success(deletedContact)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Load.
 * @returns {contact}
 */
function load(req, res, next, id) {
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        req.contact = contact;
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
  reply,
  remove,
};
