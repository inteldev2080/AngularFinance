import mongoose from 'mongoose';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';

/**
 * Recipes Schema
 */
const RecipesSchema = new mongoose.Schema({
  barcode: {
    type: String,
    trim: true,
    required: true
  },
  barcodeImage: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    trim: true,
    required: true
  },
  addIngredients: [
    {
      ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredients',
        required: false
      },
      quantity: Number,
      unit: String
    }
  ],
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredients',
    required: false
  }],
  arabicName: {
    type: String,
    trim: true
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
  },
  type: {
    type: Number,
    default: 1 // 1 receipt 2 item
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


/**
 * @typedef Recipes
 */
export default mongoose.model('Recipes', RecipesSchema);
