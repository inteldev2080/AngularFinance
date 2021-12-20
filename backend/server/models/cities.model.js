import mongoose from 'mongoose';

/**
 * Log Schema
 */
const CitiesSchema = new mongoose.Schema({
  arabicName: {
    type: String,
    required: false
  },
  englishName: {
    type: String,
    required: true
  },
  coordinates: {
    type: [Number]
  },
  status: {
    type: String,
    enum: ['Active', 'Archive'],
    required: true,
    default: 'Active'
  },
  address: {
    type: String,
    required: false
  }
});


/**
 * @typedef Log
 */
export default mongoose.model('CitiesSchema', CitiesSchema);
