// import fs from 'fs';
import httpStatus from 'http-status';
// import moment from 'moment';
import Response from '../services/response.service';
import Email from '../models/emailTemplate.model';

function list(req, res) {
  Email.find()
    .sort({
      createdAt: -1
    })
    .then((emails) => {
      const resultObj = {};
      emails.forEach((emailObj) => {
        resultObj[emailObj.type] = {
          original_template: emailObj.original_template,
          template: emailObj.template,
          keys: emailObj.key
        };
      });
      res.json(Response.success(resultObj));
    });
}

function create(req, res) {
  const email = new Email({
    type: req.body.type,
    template: {
      ar: {
        title: req.body.arabicTitle,
        body: req.body.arabicBody
      },
      en: {
        title: req.body.englishTitle,
        body: req.body.englishBody
      }
    },
    key: req.body.key
  });
  email.save()
    .then(savedEmail => res.json(Response.success(savedEmail)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
}

function update(req, res) {
  Email.findOne({
      type: req.body.type.toUpperCase()
    })
    .then((email) => {
      email.template.ar.title = req.body.arabicTitle;
      email.template.ar.body = req.body.arabicBody;
      email.template.en.title = req.body.englishTitle;
      email.template.en.body = req.body.englishBody;
      email.key = req.body.key;
      email.save()
        .then(savedEmail => res.json(Response.success(savedEmail)))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
    });
}

function get(req, res) {
  const email = req.email;
  res.json(Response.success(email));
}

function reset(req, res) {
  Email.findOne({
      type: req.body.title
    })
    .then((email) => {
      email.template = email.original_template;
      email.save()
        .then(savedEmail => res.json(Response.success(savedEmail)))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    });
}

function load(req, res, next, id) {
  Email.findById(id)
    .then((email) => {
      if (email) {
        req.email = email;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

export default {
  list,
  create,
  update,
  get,
  reset,
  load
};
