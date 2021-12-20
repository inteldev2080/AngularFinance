import mongoose from 'mongoose';
import moment from 'moment-timezone';
// import sequenceGenerator from 'mongoose-sequence-plugin';
import appSettings from '../../appSettings';

/**
 * Order Schema
 */
const OrderSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderReview',
    required: false
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  branchName: {
    type: String,
    required: false,
    default: ''
  },
  orderId: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  VAT: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Rejected', 'Canceled', 'Accepted', 'FailedToDeliver', 'ReadyForDelivery', 'OutForDelivery', 'Delivered', 'CanceledByCustomer'],
    default: 'Pending',
    required: true
  },
  rejectionReason: {
    type: String,
    required: false
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  },
  canBeCanceled: {
    type: Boolean,
    default: true,
    required: true
  },
  isReccuring: {
    type: Boolean,
    default: false,
    required: false
  },
  rejectedProductsFlag: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '',
    required: false
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  updatedAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  deliveryDate: {
    type: Date,
    required: false
  },
  deliveryDateIslamic: {
    type: Date,
    required: false
  },
  deliveryImage: {
    type: String,
    required: false
  }
});

// OrderSchema.plugin(sequenceGenerator, {
//   field: 'orderId',
//   startAt: '${appSettings.orderPrefix}120000001'
// });


/**
 * @typedef Order
 */
export default mongoose.model('Order', OrderSchema);
