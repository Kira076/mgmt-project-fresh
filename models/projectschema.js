var mongoose = require('mongoose');
var express = require('express');
var autopop = require('mongoose-autopopulate');
var uniquearray = require('mongoose-unique-array');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  title: { type: String, required: true, index: true, unique: true },
  start_date: { type: Date, required: true, index: true },
  finish_date: { type: Date },
  director: { type: Schema.Types.ObjectId, ref: 'Credit', required: true, autopopulate: true },
  other_credits: [{ type: Schema.Types.ObjectId, ref: 'Credit', autopopulate: true }],
  stages: [{ type: Schema.Types.ObjectId, ref: 'Stage', autopopulate: true }],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note', autopopulate: true }],
  flags: [{  }],
  checks: [{  }]
});

ProjectSchema.pre('remove', function(next){
  var project = this;
  project.model('Stage').update({ episode: project._id }, { $unset: { episode: 1 } }, { multi: true }, next);
});

ProjectSchema.plugin(autopop);
ProjectSchema.plugin(uniquearray);

var ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;
