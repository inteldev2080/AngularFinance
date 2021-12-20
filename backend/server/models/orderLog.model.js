import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
/**
 * OrderLog Schema
 */
const OrderLogSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userName: {
    type: String
  },
  userType: {
    type: String,
    enum: ['Supplier', 'Customer']
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  message: {
    type: String,
    default: '',
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Rejected', 'Canceled', 'Accepted', 'FailedToDeliver', 'ReadyForDelivery', 'OutForDelivery', 'Delivered', 'CanceledByCustomer'],
    required: false
  }
});


/**
 * @typedef OrderLog
 */
export default mongoose.model('OrderLog', OrderLogSchema);
