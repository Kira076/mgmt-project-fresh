var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CrewSchema = new Schema({
  name: { type: String, required: true, index: true },
  interval: { type: String, enum: ['Weekly', "Monthly"], required: true },
  completed: { type: Number, default: 0 },
  queue: { type: Number, default: 0 },
  credits: [{ type: Schema.Types.ObjectId, ref: 'Credit' }],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});

CrewSchema.virtual('url').get(function(){
  return '/crew/member/' + this._id;
});

var CrewModel = mongoose.model('Crew', CrewSchema);

CrewSchema.pre('init', function(data){
  CrewModel.populate(data, {
    path: 'credits notes'
  }, function(err, crew){
    data = crew;
  });
});

module.exports = CrewModel;
