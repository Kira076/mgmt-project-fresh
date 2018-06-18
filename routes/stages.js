var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');

router.get('/list', function(req, res) {
  StageModel.find(function(err, stages){
    if(err){
      res.send(err);
    } else {
      res.render('stagelist', {
        "stagelist" : stages,
        "moment" : moment
      });
    }
  });
});

router.get('/stage/:stageID', function(req, res){
  var Id1 = req.params.stageID;

  StageModel.findOne({ _id: Id1 }, function(err, stage){
    if(err){
      res.send(err);
    } else {
      res.render('stage', {
        "data" : stage,
        "moment" : moment
      });
    }
  });
});

router.get('/delete/:stageID', function(req, res){
  var Id1 = req.params.stageID;
  StageModel.deleteOne({ _id: Id1 }, function(err){
    if(err){
      console.log(err);
    } else {
      res.render('stagedeleted');
    }
  });
});

module.exports = router;
