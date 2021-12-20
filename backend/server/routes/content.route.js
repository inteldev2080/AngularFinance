import express from 'express';
// import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import contentCtrl from '../controllers/content.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(contentCtrl.list)

  .post(validate(paramValidation.createContent), contentCtrl.create);

router.route('/:contentId')
  .put(validate(paramValidation.updateContent), contentCtrl.update)
  .get(validate(paramValidation.getContentValidator), contentCtrl.get)
  .delete(validate(paramValidation.getContentValidator), contentCtrl.remove);

router.param('contentId', contentCtrl.load);


export default router;
