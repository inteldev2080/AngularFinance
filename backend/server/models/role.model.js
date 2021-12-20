import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
/**
 * Role Schema
 */
const RoleSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userType: {
    type: String,
    enum: ['Customer', 'Supplier', 'Admin'],
    required: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  isLocked: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  arabicName: {
    type: String,
    trim: true,
    required: true
  },
  englishName: {
    type: String,
    trim: true,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false
  }
});


/**
 * @typedef Role
 */
export default mongoose.model('Role', RoleSchema);
