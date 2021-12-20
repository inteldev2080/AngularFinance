import mongoose from 'mongoose';

/**
 * Log Schema
 */
const UnitSchema = new mongoose.Schema({
  arabicName: {
    type: String,
    required: true
  },
  englishName: {
    type: String,
    required: true
  }
});


/**
 * @typedef Log
 */
export default mongoose.model('UnitSchema', UnitSchema);
