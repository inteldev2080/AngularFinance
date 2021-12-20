import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
/**
 * Log Schema
 */
const ResetPasswordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  expireDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['New', 'Used', 'Canceled'],
    default: 'New',
  },
  createdAt: {
    type: Date
  }
});


/**
 * @typedef ResetPasswordSchema
 */
export default mongoose.model('ResetPassword', ResetPasswordSchema);
