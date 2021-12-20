import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';


/**
 * Category Schema
 */
const CategorySchema = new mongoose.Schema({
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: this,
    required: false
  },
  childCategory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: this,
    required: false
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  }],
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
  status: {
    type: String,
    enum: ['Active', 'Hidden'],
    default: 'Active',
    required: true
  },
  createdAt: {
    type: Date,
    default: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  }
});


/**
 * @typedef Category
 */
export default mongoose.model('Category', CategorySchema);
