import mongoose from 'mongoose';
import moment from 'moment-timezone';
// import sequenceGenerator from 'mongoose-sequence-plugin';
import appSettings from '../../appSettings';

/**
 * Invoice Schema
 */
const Invoice = new mongoose.Schema({
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  }],
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  dueDate: {
    type: Date,
    required: false
  },
  invoiceId: {
    type: String,
    required: false
  },
  total: {
    type: Number,
    required: false,
    default: 0
  },
  close: {
    type: Number,
    required: false,
    default: 0
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  VAT: {
    type: Number,
    required: false,
    default: 0
  },
  isPaid: {
    type: Boolean,
    required: false,
    default: false
  }
});

// Invoice.plugin(sequenceGenerator, {
//   field: 'invoiceId',
//   startAt: 'SUPIv150000001'
// });
/**
 * @typedef Invoice
 */
export default mongoose.model('Invoice', Invoice);
