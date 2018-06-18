var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');

router.get('/list', function(req, res) {
  CrewModel.find(null, 'name role interval completed queue notes', function(err, crew){
    if(err){
      res.send(err);
    } else {
      res.render('crewlist', {
        "crewlist" : crew
      });
    }
  });
});

router.get('/member/:crewID', function(req, res){
  var Id1 = req.params.crewID;

  CrewModel.findOne({ _id: Id1 }, function(err, crew){
    if(err){
      res.send(err);
    } else {
      res.render('crewmember', {
        "data" : crew,
        "moment" : moment
      });
    }
  });
});

router.get('/new', function(req, res){
  res.render('newcrew', {title: 'Add Crew'});
});

router.get('/delete/:crewID', function(req, res){
  var Id1 = req.params.crewID;
  CrewModel.deleteOne({ _id: Id1 }, function(err){
    if(err){
      console.log(err);
    } else {
      res.render('crewdeleted');
    }
  });
});

router.post('/add', function(req, res){
  var crew1 = new CrewModel({
    name: req.body.crew,
    role: req.body.role,
    interval: req.body.interval
  });

  crew1.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('list');
    }
  });
});

module.exports = router;
