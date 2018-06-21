var mongoose = require('mongoose');
var express = require('express');
var autopop = require('mongoose-autopopulate');

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

ProjectSchema.virtual('additional_crew').get(function(){
  return this.additional_credits.values();
});

var ProjectModel = mongoose.model('Project', ProjectSchema);

ProjectSchema.pre('init', function(data){
  ProjectModel.populate(data, {
    path: 'director other_credits stages notes'
  }, function(err, proj){
    data = proj;
  });
});

module.exports = ProjectModel;
