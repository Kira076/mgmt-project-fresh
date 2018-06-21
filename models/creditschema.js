var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CreditSchema = new Schema({
  credit: { type: String, required: true, index: true },
  credit_type: { type: String },
  name: { type: String, required: true, index: true },
  crew_id: { type: Schema.Types.ObjectId, ref: 'Crew', autopopulate: true },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note', autopopulate: true }]
});

var CreditModel = mongoose.model('Credit', CreditSchema);

module.exports = CreditModel;
