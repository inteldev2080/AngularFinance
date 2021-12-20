import express from 'express';
import passport from 'passport/lib';
import validate from 'express-validation';
import cityCtrl from '../controllers/cities.controller';
import paramValidation from '../../config/param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(cityCtrl.list)

  .post(passport.authenticate('jwt', { session: false }), validate(paramValidation.createCityValidator), cityCtrl.create);

router.route('/:cityId')
  .put(passport.authenticate('jwt', { session: false }), validate(paramValidation.updateCityValidator), cityCtrl.update)
  .get(passport.authenticate('jwt', { session: false }), validate(paramValidation.getCityValidator), cityCtrl.get)
  .delete(passport.authenticate('jwt', { session: false }), validate(paramValidation.getCityValidator), cityCtrl.remove);

router.param('cityId', cityCtrl.load);

export default router;
