import mongoose from 'mongoose';

/**
 * Permission Schema
 */
const PermissionSchema = new mongoose.Schema({
  allowedEndPoints: {
    type: [String],
    required: false
  },
  arabicName: {
    type: String,
  },
  englishName: {
    type: String
  },
  key: {
    type: String
  },
  type: {
    type: String,
    enum: ['Customer', 'Admin', 'Supplier'],
    required: true
  }
});


/**
 * @typedef Permission
 */
export default mongoose.model('Permission', PermissionSchema);
