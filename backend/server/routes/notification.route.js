import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import notificationCtrl from '../controllers/notification.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(passport.authenticate('jwt', {
    session: false
  }), notificationCtrl.list);

router.route('/:notificationId')
  .get(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.getNotification), notificationCtrl.get)
  .put(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.getNotification), notificationCtrl.update);

router.param('notificationId', notificationCtrl.load);

export default router;
