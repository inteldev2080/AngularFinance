import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

/**
 * CustomerProductPrice Schema
 */
const CustomerProductPriceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: false
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
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
 * @typedef CustomerProductPrice
 */
export default mongoose.model('CustomerProductPrice', CustomerProductPriceSchema);
