import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

/**
 * Notification Schema
 */

const Notification = new mongoose.Schema({
  reference: {
    type: {
      type: String,
      enum: ['order', 'product', 'payment', 'customer', 'supplier', 'user', 'invoice'],
      required: false
    },
    refObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      enum: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
          required: false
        },
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'pendingPayment',
          required: false
        },
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: false
        },
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: false
        }],
      required: false
    }
  },
  level: {
    type: String,
    enum: ['success', 'warning', 'danger', 'info'],
    required: false
  },
  isRead: {
    type: Boolean,
    required: false,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  actionTitle: {
    ar: {
      type: String,
      required: false
    },
    en: {
      type: String,
      required: false
    },
    actionUrl: {
      type: String,
      required: false
    }
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  updatedAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  url: {
    type: String,
    required: false
  },
  stateParams: {
    type: String,
    enum: ['order', 'product', 'payment', 'customer', 'supplier', 'user', 'invoice', null],
    required: false
  }
});

/**
 * @typedef Notification
 */
export default mongoose.model('Notification', Notification);
