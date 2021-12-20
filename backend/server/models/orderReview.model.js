import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
/**
 * OrderReview Schema
 */
const OrderReviewSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    ref: 'Order',
    required: true
  },
  itemCondition: {
    type: Number,
    min: 0,
    max: 5,
    validate: {
      validator: itemCondition => Number.isInteger(itemCondition)
    },
    required: true
  },
  delivery: {
    type: Number,
    min: 0,
    max: 5,
    validate: {
      validator: delivery => Number.isInteger(delivery)
    },
    required: true
  },
  overall: {
    type: Number,
    min: 0,
    max: 5,
    validate: {
      validator: overall => Number.isInteger(overall)
    },
    required: true
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
});


/**
 * @typedef OrderReview
 */
export default mongoose.model('OrderReview', OrderReviewSchema);
