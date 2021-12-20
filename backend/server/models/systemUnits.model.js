const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  option: {
    arabic: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    }
  }
});

optionSchema.statics.createOption = function (OptionInfo) { // eslint-disable-line func-names
  return this.create(OptionInfo);
};

optionSchema.statics.getOptions = function () { // eslint-disable-line func-names
  return this.find().populate('parent');
};

optionSchema.methods.updateOption = function (OptionInfo) { // eslint-disable-line func-names
  return this.update(OptionInfo, { runValidators: true });
};

optionSchema.methods.removeOption = function () { // eslint-disable-line func-names
  return this.remove();
};

const SystemUnits = mongoose.model('SystemUnits', optionSchema);

optionSchema.add({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SystemUnits',
    validate: {
      validator: (OptionId, callback) => {
        SystemUnits.count({ _id: OptionId })
          .then(count => callback(count), err =>
            // TODO: log
             callback(0, err));
      }
    }
  }
});


module.exports = {
  optionSchema,
  SystemUnits
};
