import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
/**
 * Supplier Schema
 */
const SupplierSchema = new mongoose.Schema({
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  representativeName: {
    type: String,
    trim: true,
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: false,
      default: [26.31, 50.14]
    },
    address: {
      type: String,
      required: false,
      default: null
    }
  },
  commercialRegister: {
    type: String,
    trim: true,
    required: true
  },
  commercialRegisterExpireDate: {
    type: Date,
    required: false
  },
  commercialRegisterExpireDateIslamic: {
    type: Date,
    required: false
  },
  commercialRegisterPhoto: {
    type: String,
    trim: true,
    required: true
  },
  VATRegisterNumber: {
    type: Number,
    trim: true,
    required: false
  },
  VATRegisterPhoto: {
    type: String,
    trim: true,
    required: false
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
    enum: ['Month', 'Week', 'Day'],
    trim: true,
    required: false,
    default: 'Month'
  },
  days: {
    type: Number,
    required: false,
    default: moment().add(1, 'M').diff(moment(), 'days')
  },
  exceedCreditLimit: {
    type: Boolean,
    default: false
  },
  exceedPaymentDate: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Blocked', 'Deleted'],
    required: true,
    default: 'Active'
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
  coverPhoto: {
    type: String,
    required: false,
    default: '1fbdcdb97fbfdf5852f5dd7934d9a7e3'
  },
  photo: {
    type: String,
    required: false,
    default: '1fbdcdb97fbfdf5852f5dd7934d9a7e3'
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  },
  inDebit: {
    type: Boolean,
    required: false,
    default: false
  },
  dueDateMissed: {
    type: Boolean,
    default: false
  },
  adminFees: {
    type: Number,
    required: true,
    default: appSettings.supplierAdminPercent
  },
  payingSoon: {
    type: Boolean,
    required: false,
    default: false
  },
  canReceiveOrder: {
    type: Boolean,
    required: false,
    default: true
  },
  reservedBalance: {
    type: Number,
    required: false,
    default: 0
  },
  installment: {
    type: Number,
    required: false,
    default: 0
  }
});


/**
 * @typedef Supplier
 */
export default mongoose.model('Supplier', SupplierSchema);
