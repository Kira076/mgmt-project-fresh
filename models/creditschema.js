var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CreditSchema = new Schema({
  credit: { type: String, required: true, index: true },
  credit_type: { type: String },
  name: { type: String, required: true, index: true },
  id: { type: Schema.Types.ObjectId, ref: 'Crew' },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});

var CreditModel = mongoose.model('Credit', CreditSchema);

CreditSchema.pre('init', function(data){
  CreditModel.populate(data, {
    path: 'id stages projects notes'
  }, function(err, credit){
    data = credit;
  });
});

module.exports = CreditModel;
