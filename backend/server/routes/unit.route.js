import express from 'express';
// import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import unitCtrl from '../controllers/unit.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(unitCtrl.list)

  .post(validate(paramValidation.createUnit), unitCtrl.create);

router.route('/:unitId')
  .put(validate(paramValidation.updateUnit), unitCtrl.update)
  .get(validate(paramValidation.getUnit), unitCtrl.get)
  .delete(validate(paramValidation.getUnit), unitCtrl.remove);

router.param('unitId', unitCtrl.load);

export default router;

// router.route('/')
//   .get((req, res, next) => {
//     res.locals.promise = SystemUnits.optionSchema.getOptions();
//     return next();
//   })
//
//   .post((req, res, next) => { res.locals.promise = SystemUnits.optionSchema.createOption(req.body); return next(); });
//
// router.route('/:OptionId')
//   .get((req, res) => res.send(req.params.Option))
//   .put((req, res, next) => { res.locals.promise = req.params.Option.updateOption(req.body); return next(); })
//   .delete((req, res, next) => { res.locals.promise = req.params.Option.removeOption(); return next(); });
//
// router.param('OptionId', (req, res, next, OptionId) => {
//   SystemUnits.optionSchema.findById(OptionId)
//     .then((Option) => {
//       if (!Option) {
//         return next(new Error('Option Does Not Exist'));
//       } else {
//         req.params.Option = Option;
//         return next();
//       }
//     }, err => next(err) )
// });
