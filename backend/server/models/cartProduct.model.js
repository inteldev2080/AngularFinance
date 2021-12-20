import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
moment.locale('en');
/**
 * CartProduct Schema
 */
const CartProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
    validate: {
      validator: quantity => Number.isInteger(quantity)
    }
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  }
});


/**
 * @typedef CartProduct
 */
export default {
  Model: mongoose.model('CartProduct', CartProductSchema),
  Schema: CartProductSchema
};
