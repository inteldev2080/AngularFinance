const mongoose = require('mongoose');
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
// const User = require('./user.model').User;

const STATUS = {
  PUBLISHED: 'PUBLISHED',
  APPROVED: 'APPROVED',
  PROVOKED: 'PROVOKED',
  PENDING: 'PENDING',
  ONHOLD: 'ONHOLD',
  SUSPENDED: 'SUSPENDED'
};

const ContentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  title: {
    arabic: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    }
  },
  body: {
    arabic: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: [
      STATUS.PUBLISHED,
      STATUS.APPROVED,
      STATUS.PROVOKED,
      STATUS.PENDING,
      STATUS.ONHOLD,
      STATUS.SUSPENDED],
    default: STATUS.PENDING
  },
  key: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  updatedAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  }
});

export default mongoose.model('Content', ContentSchema);
