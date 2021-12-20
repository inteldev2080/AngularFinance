import mongoose from 'mongoose';
import CartProduct from '../models/cartProduct.model';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

/**
 * RecurringOrder Schema
 */
const RecurringOrderSchema = new mongoose.Schema({
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
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  orderIntervalType: {
    type: String,
    trim: true,
    required: true
  },
  orderId: {
    type: String,
    required: false
  },
  orderFrequency: {
    type: Number,
    required: true
  },
  days: {
    type: Number,
    required: false
  },
  startDate: {
    type: Date,
    required: true,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
    required: true
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  updatedAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  }
});


/**
 * @typedef RecurringOrder
 */
export default mongoose.model('RecurringOrder', RecurringOrderSchema);
