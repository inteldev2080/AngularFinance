import mongoose from 'mongoose';

/**
 * OrderProduct Schema
 */
const OrderProductSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: quantity => Number.isInteger(quantity)
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
    required: true
  },
  isAdded: {
    type: Boolean,
    required: false,
    default: false
  }
});


/**
 * @typedef OrderProduct
 */
export default mongoose.model('OrderProduct', OrderProductSchema);
