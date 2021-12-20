// import moment from 'moment-timezone';

const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Active', 'InActive'],
    default: 'Active'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  branchName: {
    type: String,
    required: true,
    default: ''
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    },
    address: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CitiesSchema'
    }
  },
  createdAt: {
    type: Date
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }
});

export default mongoose.model('Branch', BranchSchema);
