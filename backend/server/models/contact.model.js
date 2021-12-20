// import User from './user.model';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

const mongoose = require('mongoose');
// const emailHandler = require('../../config/emailHandler');

const TYPE = {
  OPEN: 'Open',
  CLOSED: 'Closed',
  PENDING: 'Pending'
};

const ContactSchema = new mongoose.Schema({
  status: {
    type: String,
    default: TYPE.OPEN,
    enum: [TYPE.OPEN, TYPE.CLOSED, TYPE.PENDING],
  },
  category: {
    type: String,
    required: false,
    default: ''
  },
  user: {
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
  },
  message: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    body: {
      type: String,
      required: true,
      default: ''
    }
  },
  is_seen: {
    type: Boolean,
    required: false,
    default: false
  },
  replies: [{
    user: {
      type: String,
      required: false,
      default: ''
    },
    reply: {
      type: String,
      required: false,
      default: ''
    },
    createdAt: {
      type: Date,
      default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
    }
  }],
  language: {
    type: String
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  updatedAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
});

export default mongoose.model('Contact', ContactSchema);
