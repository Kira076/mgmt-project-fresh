var mongoose = require('mongoose');
var express = require('express');
var autopop = require('mongoose-autopopulate');
var uniquearray = require('mongoose-unique-array');

var Schema = mongoose.Schema;

var StageSchema = new Schema({
  episode: { type: Schema.Types.ObjectId, ref: 'Project', index: true, autopopulate: true }, //req
  stage_type: { type: Number }, //req
  start_date: { type: Date, index: true }, //req
  finish_date: { type: Date },
  deadline: { type: Date },
  lead: { type: Schema.Types.ObjectId, ref: 'Credit', autopopulate: true },
  primary: { type: Schema.Types.ObjectId, ref: 'Credit', autopopulate: true }, //req
  other_credits: [{ type: Schema.Types.ObjectId, ref: 'Credit', autopopulate: true }],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note', autopopulate: true }],
  flags: [{  }],
  checks: [{  }]
});

StageSchema.virtual('stage_name').get(function(){
  var names = ['Outline', 'Storyboard', 'Animation', 'Color', 'Thumbnail', 'Pencil1', 'Retime1', 'Voice', 'Retime2', 'Music', 'Retime 3', 'SFX', 'Pencil2', 'Export'];
  return names[this.stage_type];
});

StageSchema.pre('remove', function(next){
  var stage = this;
  stage.model('Project').update({ stages: { $in: stage._id } }, { $pull: { stages: stage._id } }, { multi: true }, next);
});

StageSchema.plugin(autopop);
StageSchema.plugin(uniquearray);

var StageModel = mongoose.model('Stage', StageSchema);

module.exports = StageModel;
