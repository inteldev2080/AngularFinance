import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

/**
 * Recipes Schema
 */
const RecipesItemsSchema = new mongoose.Schema({
  barcode: {
    type: String,
    trim: true,
    required: true
  },
  sku: {
    type: String,
    trim: true,
    required: true
  },
  ingredient: {
    type: String,
    trim: true,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    trim: true,
    required: true
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
 * @typedef RecipesItems
 */
export default mongoose.model('RecipesItems', RecipesItemsSchema);
