const mongoose = require('mongoose');


const TYPE = {
  ORDERS: 'ORDERS',
  TRANSACTIONS: 'TRANSACTIONS'

};

const ReportTemplateSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      TYPE.ORDERS, TYPE.TRANSACTIONS
    ],
  },
  template: {
    arabic: {
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      }
    },
    english: {
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      }
    }
  },
});

ReportTemplateSchema.statics.getTemplateByType
  = function (templateType) { // eslint-disable-line func-names
    return this.findOne({ type: templateType });
  };


/**
 * @typedef Cart
 */
export default mongoose.model('ReportTemplateSchema', ReportTemplateSchema);
