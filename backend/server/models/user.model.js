import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: false
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: false
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Blocked', 'Deleted'],
    required: true,
    default: 'Active'
  },
  type: {
    type: String,
    enum: ['Customer', 'Supplier', 'Admin'],
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  invitesByCustomer: {
    type: Boolean,
    default: false
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'ar'],
    required: false,
    default: 'ar'
  }
}, { validateBeforeSave: false });


/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
