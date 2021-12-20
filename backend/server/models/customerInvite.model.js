import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
/**
 * CustomerInvite Schema
 */
const CustomerInviteSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Invited', 'Active', 'Blocked'],
    required: true
  },
  creditLimit: {
    type: Number,
    required: false,
    default: 3000
  },
  paymentFrequency: {
    type: Number,
    required: false,
    default: 1
  },
  paymentInterval: {
    type: String,
    trim: true,
    required: false,
    default: 'Month'
  },
  days: {
    type: Number,
    required: false,
    default: moment().tz(appSettings.timeZone).add(1, 'M').diff(moment(), 'days')
  },
  exceedCreditLimit: {
    type: Boolean,
    default: false
  },
  exceedPaymentDate: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  nextPaymentDueDate: {
    type: Date,
    default: moment().tz(appSettings.timeZone).endOf('month').add(1, 'M')
  },
  startPaymentDate: {
    type: Date
  },
  canOrder: {
    type: Boolean,
    default: true
  },
  reservedBalance: {
    type: Number,
    required: false,
    default: 0
  },
  dueDateMissed: {
    type: Boolean,
    default: false
  },
  payingSoon: {
    type: Boolean,
    default: false
  },
  installment: {
    type: Number,
    required: false,
    default: 0
  }
});


/**
 * @typedef CustomerInvite
 */
export default mongoose.model('CustomerInvite', CustomerInviteSchema);
