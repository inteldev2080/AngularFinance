import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
/**
 * Product Schema
 */
const ProductSchema = new mongoose.Schema({
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
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
  arabicDescription: {
    type: String,
    trim: true,
    required: true
  },
  englishDescription: {
    type: String,
    trim: true,
    required: true
  },
  sku: {
    type: String,
    trim: true
  },
  store: {
    type: String,
    trim: true
  },
  shelf: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnitSchema',
    required: false
  },
  images: {
    type: [String],
    required: false
  },
  coverPhoto: {
    type: String,
    required: false,
    default: '1fbdcdb97fbfdf5852f5dd7934d9a7e3'
  },
  status: {
    type: String,
    enum: ['Active', 'Hidden'],
    required: true,
    default: 'Active'
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
 * @typedef Product
 */
export default mongoose.model('Product', ProductSchema);
