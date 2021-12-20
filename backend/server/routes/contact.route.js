import express from 'express';
// import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import contactCtrl from '../controllers/contact.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(contactCtrl.list)

  .post(validate(paramValidation.createContact), contactCtrl.create);

router.route('/:contactId')
  .put(validate(paramValidation.updateContactValidator), contactCtrl.update)
  .get(validate(paramValidation.getContactValidator), contactCtrl.get)
  .delete(validate(paramValidation.getContactValidator), contactCtrl.remove);

router.route('/reply/:contactId')
  .put(validate(paramValidation.replyValidator), contactCtrl.reply);

router.param('contactId', contactCtrl.load);

export default router;
