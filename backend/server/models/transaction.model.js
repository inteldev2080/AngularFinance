import mongoose from 'mongoose';
import moment from 'moment-timezone';
// import sequenceGenerator from 'mongoose-sequence-plugin';
import appSettings from '../../appSettings';

/**
 * Transaction Schema
 */
const TransactionSchema = new mongoose.Schema({
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
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
    required: false
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    default: null,
    required: false
  },
  transId: {
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
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  paymentMethod: {
    type: String,
    enum: ['Bank', 'Cheque', 'Cash'],
    required: false
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: true
  },
  status: {
    type: String,
    required: false,
    default: 'Approved'
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
  date: {
    type: Date,
    required: false
  },
  chequeNumber: {
    type: String,
    required: false
  },
  recipientName: {
    type: String,
    required: false
  },
  open: {
    type: Number,
    required: false
  },
  close: {
    type: Number,
    required: false
  },
  isPaid: {
    type: Boolean,
    required: false,
    default: false
  },
  PVAT: {
    type: Number,
    required: false,
    default: appSettings.VATPercent
  }
});

// TransactionSchema.plugin(sequenceGenerator, {
//   field: 'transId',
//   startAt: '${appSettings.transactionPrefix}appSettings.transactionIdInit'
// });
/**
 * @typedef Transaction
 */
export default mongoose.model('Transaction', TransactionSchema);
