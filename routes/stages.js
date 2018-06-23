var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');
var CreditModel = require('../models/creditschema');
var maps = require('../configs/maps');

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

router.get('/new/:jsonObj', function(req, res){
  var data = JSON.parse(req.params.jsonObj);
  var credlist;

  CreditModel.find({}, '_id credit name').exec()
  .then(function(credits){
    credlist = credits;
    if(data == {}){
      return ProjectModel.find({}, '_id title').exec();
    } else {
      return new Promise(resolve => "for");
    }
  })
  .then(function(result){
    res.render('newstage', {
      title: 'Add Stage',
      credlist: credlist,
      projlist: result,
      target: data.target,
      stage_names: maps.stage_names
    });
  })
  .catch(function(error){
    res.send(error);
  });
});

router.post('/add', function(req, res){
  var stage1 = new StageModel({
    episode: req.body.episode,
    type: req.body.type,
    start_date: req.body.start_type,
    primary: req.body.primary
  });

  StageModel.save(stage1)
  .then(function(stage){
    return ProjectModel.findOne({ _id: req.body.episode }).exec();
  })
  .then(function(episode){
    episode.stages.push(stage1._id);
    return episode.save();
  })
  .then(function(episode){
    res.redirect('list');
  })
  .catch(function(error){
    res.send(error);
  });
});

module.exports = router;
