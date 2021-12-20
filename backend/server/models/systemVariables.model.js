const mongoose = require('mongoose');

const STATUS = {
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  NUMBER: 'NUMBER',
  HTML: 'HTML'
};

const systemVariableSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: false,
    default: 0
  },
  group: {
    type: String,
    required: true
  },
  isSerializable: {
    type: Boolean,
    required: false,
    default: false
  },
  isHidden: {
    type: Boolean,
    required: false,
    default: false
  },
  type: {
    type: String,
    enum: [STATUS.STRING, STATUS.BOOLEAN, STATUS.NUMBER, STATUS.HTML],
    default: STATUS.STRING
  },
});

export default mongoose.model('SystemVariables', systemVariableSchema);

