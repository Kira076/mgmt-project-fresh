var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment');
var Async = require('async');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');

router.get('/list', function(req, res) {
  ProjectModel.find(null, 'title start_date finish_date director flags', function(err, proj){
    if(err){
      res.send(err);
    } else {
      res.render('projlist', {
        "projlist" : proj,
        "moment" : moment
      });
    }
  });
});

router.get('/episode/:projID', function(req, res){
  var Id1 = req.params.projID;

  ProjectModel.findOne({ _id: Id1 }, function(err, proj){
    if(err){
      res.send(err);
    } else {
      res.render('episode', {
        "data" : proj,
        "moment" : moment
      });
    }
  });
});

router.get('/new', function(req, res){
  CrewModel.find({}, '_id name', function(err, crew){
    if(err){
      res.send(err);
    } else {
      res.render('newproject', {
        title: 'Add Project',
        "crewlist" : crew
      });
    }
  });
});

router.get('/delete/:projID', function(req, res){
  var Id1 = req.params.projID;
  ProjectModel.deleteOne({ _id: Id1 }, function(err){
    if(err){
      res.send(err);
    } else {
      res.render('projectdeleted');
    }
  });
});

router.post('/add', function(req, res){
  var obj = { title: req.body.title, start_date: req.body.start_date, director: req.body.director };
  var proj1 = new ProjectModel(obj);

  proj1.save(function(err){
    if(err){
      res.send(err);
    } else {
      res.redirect('list');
    }
  });
});

router.get('/newstage/:projID', function(req, res){
  var Id1 = req.params.projID;
  CrewModel.find({}, '_id name', function(err, crew){
    if(err){
      res.send(err);
    } else {
      res.render('newstage', {
        title: 'Add Stage',
        "crewlist" : crew,
        "stageID" : Id1
      });
    }
  });
});

router.post('/addstage', function(req, res){
  var stage1 = new StageModel({
    episode: req.body.episode,
    stage_type: req.body.stage_type,
    start_date: req.body.start_date,
    deadline: req.body.deadline,
    lead: req.body.lead,
    primary: req.body.primary
  });

  ProjectModel.updateOne({ _id: req.body.episode }, { "$push": { "stages": stage1._id } }, function(err, raw){
    if(err){
      res.send(err);
    } else {
      stage1.save(function(err){
        if(err){
          res.send(err);
        } else {
          res.redirect('list');
        }
      });
    }
  });
});

module.exports = router;
