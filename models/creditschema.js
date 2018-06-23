var mongoose = require('mongoose');
var autopop = require('mongoose-autopopulate');
var uniquearray = require('mongoose-unique-array');

var Schema = mongoose.Schema;

var CreditSchema = new Schema({
  credit: { type: String, index: true }, //req
  credit_type: { type: String },
  name: { type: String, index: true }, //req
  crew_id: { type: Schema.Types.ObjectId, ref: 'Crew', autopopulate: true },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note', autopopulate: true }]
});

CreditSchema.pre('remove', function(next){
  var credit = this;
  credit.model('Crew').update({ credits: credit._id }, { $pull: { credits: credit._id } }, { multi: true }).exec()
  .then(function(result){
    return credit.model('Stage').update({ other_credits: credit._id }, { $pull: { other_credits: credit._id } }, { multi: true }).exec();
  })
  .then(function(result){
    return credit.model('Stage').update({ lead: credit._id }, { $unset: { lead: 1 } }, { multi: true }).exec();
  })
  .then(function(result){
    return credit.model('Stage').update({ primary: credit._id }, { $unset: { primary: 1 } }, { multi: true }).exec();
  })
  .then(function(result){
    return credit.model('Project').update({ other_credits: credit._id }, { $pull: { other_credits: credit._id } }, { multi: true }).exec();
  })
  .then(function(result){
    return credit.model('Project').update({ director: credit._id }, { $unset: { director: 1 } }, { multi: true }).exec();
  })
  .catch(function(err){
    next(err);
  });
  next();
});

CreditSchema.plugin(autopop);
CreditSchema.plugin(uniquearray);

var CreditModel = mongoose.model('Credit', CreditSchema);

module.exports = CreditModel;
