import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

/**
 * Customer Schema
 */

const CustomerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  type: {
    type: String,
    enum: ['Customer', 'Staff'],
    required: true,
    default: 'Customer'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  photo: {
    type: String,
    required: false,
    default: '1fbdcdb97fbfdf5852f5dd7934d9a7e3'
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    required: true,
    default: 'Active'
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    },
    address: {
      type: String,
      required: false
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CitiesSchema'
    }
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: false
  },
  representativeName: {
    type: String,
    required: true
  },
  representativePhone: {
    type: String,
    required: false,
    match: [/^[0-9]{9,12}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  representativeEmail: {
    type: String,
    required: false
  },
  commercialRegister: {
    type: String,
    trim: true,
    required: false
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
    required: false
  },
  coverPhoto: {
    type: String,
    required: false,
    default: '1fbdcdb97fbfdf5852f5dd7934d9a7e3'
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  },
  dueDateMissed: {
    type: Boolean,
    default: false
  },
  payingSoon: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  startPaymentDate: {
    type: Date
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
  }
});


/**
 * @typedef Customer
 */
export default mongoose.model('Customer', CustomerSchema);
