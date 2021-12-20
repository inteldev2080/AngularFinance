import mongoose from 'mongoose';
import moment from 'moment-timezone';
import CartProduct from '../models/cartProduct.model';
import appSettings from '../../appSettings';

moment.locale('en');
/**
 * Cart Schema
 */
const CartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  products: [CartProduct.Schema],
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  isReccuring: {
    type: Boolean,
    default: false,
    required: false
  },
  orderIntervalType: {
    type: String,
    trim: true,
    required: false
  },
  orderFrequency: {
    type: Number,
    required: false
  },
  days: {
    type: Number,
    required: false
  },
  VAT: {
    type: Number,
    required: false,
    default: 0,
    min: 0
  }
});


/**
 * @typedef Cart
 */
export default mongoose.model('Cart', CartSchema);
