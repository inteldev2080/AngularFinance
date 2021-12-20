import mongoose from 'mongoose';
import moment from 'moment-timezone';
// import sequenceGenerator from 'mongoose-sequence-plugin';
import appSettings from '../../appSettings';
/**
 * pendingPayment Schema
 */
const pendingPayment = new mongoose.Schema({
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credit',
    required: false
  },
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
  paymentId: {
    type: String,
    required: false
  },
  isAdminFees: {
    type: Boolean,
    required: true,
    default: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Bank', 'Cheque', 'Cash'],
    required: false
  },
  transactionId: {
    type: String,
    required: false
  },
  accountNumber: {
    type: String,
    required: false
  },
  accountName: {
    type: String,
    required: false
  },
  bankName: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  updateAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  date: {
    type: Date,
    required: false
  },
  chequeNumber: {
    type: Number,
    required: false
  },
  recipientName: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    required: true,
    default: 'Pending'
  }
});
// pendingPayment.plugin(sequenceGenerator, {
//   field: 'paymentId',
//   startAt: 'SUPPay-appSettings.paymentIdInit'
// });

/**
 * @typedef pendingPayment
 */
export default mongoose.model('pendingPayment', pendingPayment);
