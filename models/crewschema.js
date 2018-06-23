var mongoose = require('mongoose');
var autopop = require('mongoose-autopopulate');
var uniquearray = require('mongoose-unique-array');

var Schema = mongoose.Schema;

var CrewSchema = new Schema({
  name: { type: String, required: true, index: true },
  interval: { type: String, enum: ['Weekly', "Monthly"], required: true },
  completed: { type: Number, default: 0 },
  queue: { type: Number, default: 0 },
  credits: [{ type: Schema.Types.ObjectId, ref: 'Credit', autopopulate: true }],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note', autopopulate: true }]
});

CrewSchema.virtual('url').get(function(){
  return '/crew/member/' + this._id;
});

CrewSchema.plugin(autopop);
CrewSchema.plugin(uniquearray);

var CrewModel = mongoose.model('Crew', CrewSchema);

module.exports = CrewModel;
