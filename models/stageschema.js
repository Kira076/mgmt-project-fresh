var mongoose = require('mongoose');
var express = require('express');
var autopop = require('mongoose-autopopulate');
var uniquearray = require('mongoose-unique-array');

var Schema = mongoose.Schema;

var StageSchema = new Schema({
  episode: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true, autopopulate: true },
  stage_type: { type: Number, required: true },
  start_date: { type: Date, required: true, index: true },
  finish_date: { type: Date },
  deadline: { type: Date },
  lead: { type: Schema.Types.ObjectId, ref: 'Credit', autopopulate: true },
  primary: { type: Schema.Types.ObjectId, ref: 'Credit', required: true, autopopulate: true },
  other_credits: [{ type: Schema.Types.ObjectId, ref: 'Credit', autopopulate: true }],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note', autopopulate: true }]
});

StageSchema.virtual('stage_name').get(function(){
  var names = ['Outline', 'Storyboard', 'Animation', 'Color', 'Thumbnail', 'Pencil1', 'Retime1', 'Voice', 'Retime2', 'Music', 'Retime 3', 'SFX', 'Pencil2', 'Export'];
  return names[this.stage_type];
});

StageSchema.plugin(uniquearray);

var StageModel = mongoose.model('Stage', StageSchema);

StageSchema.pre('init', function(data){
  StageModel.populate(data, {
    path: 'episode lead primary other_credits notes'
  }, function(err, stage){
    data = stage;
  });
});

module.exports = StageModel;
