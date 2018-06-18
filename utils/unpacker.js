var db = require('../db');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');
var Async = require('async');

var ProjCollector = function(proj){
  this.id = proj;
  var self = this;

  this.colProj = function(callback){
    ProjectModel.find({ _id: self.id }, function(err, proj){
      if(err){
        callback(err, null);
      } else {
        if(proj.flags){
          var flags = proj.flags.entries();
        } else {
          flags = null;
        }
        if(proj.checks){
          var checks = proj.checks.entries();
        } else {
          checks = null;
        }
        var temp = { obj: proj[0], flags: flags, checks: checks };
        callback(null, temp);
      }
    });
  }

  this.colDirector = function(callback){
    CrewModel.find({ _id: self.id }, function(err, direc){
      if(err){
        callback(err, null);
      } else {
        callback(null, direc);
      }
    });
  }

  this.colProjStages = function(callback){
    StageModel.find({ episode: self.id }, function(err, stages){
      if(err){
        callback(err, null);
      } else {
        callback(null, stages);
      }
    });
  }

  this.colCredits = function(prop, callback){
    CrewModel.find({ _id: { $in: prop } }, function(err, crew){
      if(err){
        callback(err, null);
      } else {
        callback(null, crew);
      }
    });
  }
}

exports.unpackProject = function(id, cb){

  var col1 = new ProjCollector(id);

  Async.parallel({
    project: col1.colProj,
    stages: col1.colProjStages
  }, function(err, results){
    if(err){
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}

var CrewCollector = function(crew){
  this.id = crew;
  var self = this;

  console.log('Inside collector...');
  console.log(this.id);

  this.colDirected = function(callback){
    console.log('Inside colDirected');
    console.log(self.id);
    ProjectModel.find({ director: self.id }, function(err, directed){
      if(err){
        callback(err, null);
      } else {
        callback(null, directed);
      }
    });
  }

  this.colCredited = function(callback){
    ProjectModel.find({ additional_crew: self.id }, function(err, credited){
      if(err){
        callback(err, null);
      } else {
        var temp = {};
        for(var proj of credited){
          temp[proj._id] = { id: proj._id, episode: proj.title, credits: [] };
          for(var [key, value] of proj.additional_credits){
            if(value == id){
              temp[proj._id].credits += key;
            }
          }
        }
        callback(null, temp);
      }
    });
  }

  this.colStages = function(callback){
    StageModel.find({ $or: [{ lead: self.id }, { primary: self.id }],}, function(err, stages){
      if(err){
        callback(err, null);
      } else {
        var temp = {};
        for(var stage of stages){
          temp[stage._id] = { id: stage._id, episode: stage.episode, name: stage.stage_name, role: "Unknown" };
          if(stage.lead == id){ temp[stage._id].role = "Lead"; }
          else if(stage.primary == id){ temp[stage._id].role = "Primary"; }
        }
        callback(null, temp);
      }
    });
  }

  this.colCrew = function(callback){
    CrewModel.find({ _id: self.id }, function(err, crew){
      if(err){
        callback(err, null);
      } else {
        callback(null, crew[0]);
      }
    });
  }
}

exports.unpackCrew = function(id, cb){

  console.log(id);
  var col1 = new CrewCollector(id);

  Async.parallel({
    directing: col1.colDirected,
    credited: col1.colCredited,
    stages: col1.colStages,
    crew: col1.colCrew
  }, function(err, results){
    if(err){
      cb(err, null);
    } else {
      console.log(results);
      cb(null, results);
    }
  }
  );
}

var StageCollector = function(id){
  this.id = id;
  var self = this;

  this.colStage = function(callback){
    var temp = {};
    StageModel.find({ _id: self.id }, function(err, stage){
      if(err){
        callback(err, null);
      } else {
        temp["stage"] = stage[0];
        ProjectModel.find({ _id: stage.episode }, function(err, episode){
          
        });
      }
    });
  }
}
