var express = require('express');
var router = express.Router();
var db = require('../db');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');
var CreditsModel = require('..models/creditschema');

router.get('/list', function(req, res) {
  CreditModel.find(null, 'credit credit_type name id', function(err, credits){
    if(err){
      res.send(err);
    } else {
      res.render('creditlist', {
        "creditlist" : credits
      });
    }
  });
});

router.get('/credit/:creditID', function(req, res){
  var Id1 = req.params.creditID;

  CreditModel.findOne({ _id: Id1 }, function(err, credit){
    if(err){
      res.send(err);
    } else {
      res.render('credit', {
        "data" : credit
      });
    }
  });
});

router.get('/new/for/:crewID', function(req, res){
  var Id1 = req.params.crewID;

  res.render('newcredit', {
    title: 'Add Credit',
    "target" : Id1
  });
});

router.get('/new', function(req, res){
  CrewModel.find({}, '_id name', function(err, crew){
    if(err){
      res.send(err);
    } else {
      res.render('newcredit', {
        title: 'Add Credit',
        "crewlist" : crew
      });
    }
  });
});

router.get('/delete/:creditID', function(req, res){
  var Id1 = req.params.creditID;
  CreditModel.deleteOne({ _id: Id1 }, function(err){
    if(err){
      console.log(err);
    } else {
      res.render('creditdeleted');
    }
  });
});

router.post('/add', function(req, res){
  var crew_member = req.body.c_crew;

  if(crew_member == "None"){
    crew_member = undefined;
  }

  var credit1 = new CreditModel({
    credit: req.body.c_title,
    name: req.body.c_name,
    credit_type: req.body.c_type,
    id: crew_member
  });

  credit1.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('list');
    }
  });
});

module.exports = router;
