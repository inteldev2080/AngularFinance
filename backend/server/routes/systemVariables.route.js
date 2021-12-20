import express from 'express';
// import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import systemVariablesCtrl from '../controllers/systemVariables.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(systemVariablesCtrl.list)

  .post(validate(paramValidation.createVariable), systemVariablesCtrl.create);

router.route('/:variableId')
  .put(validate(paramValidation.updateVariable), systemVariablesCtrl.update)
  .get(validate(paramValidation.getVariable), systemVariablesCtrl.get)
  .delete(validate(paramValidation.getVariable), systemVariablesCtrl.remove);

router.param('variableId', systemVariablesCtrl.load);

export default router;
