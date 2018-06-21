var express = require('express');
var router = express.Router();
var db = require('../db');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');
var CreditModel = require('../models/creditschema');

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
    title : 'Add Credit',
    "target" : Id1
  });
});

router.get('/new', function(req, res){
  CrewModel.find({}, '_id name', function(err, crew){
    if(err){
      res.send(err);
    } else {
      res.render('newcredit', {
        title : 'Add Credit',
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
  console.log("Crew before check: ");
  console.log(crew_member);

  if(crew_member == "None"){
    crew_member = null;
  }

  console.log("Crew after check: ");
  console.log(crew_member);

  var credit1 = new CreditModel({
    "credit" : req.body.c_title,
    "name" : req.body.c_name,
    "credit_type" : req.body.c_type,
    "crew_id" : crew_member
  });

  console.log("Credit ID:");
  console.log(credit1._id);

  if(crew_member){
    credit1.save(function(err){
      if(err){
        console.log(err);
      } else {
        CrewModel.updateOne({ _id: crew_member }, { $push : { credits: credit1._id } }, { upsert: true }, function(err, raw){
          if(err){
            res.send(err);
          } else {
            res.redirect('list');
          }
        });
      }
    });
  } else {
    credit1.save(function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect('list');
      }
    });
  }
});

router.get('/attach/tocredit/:creditID', function(req, res){
  var Id1 = req.params.creditID;

  CrewModel.find({}, '_id name', function(err, crew){
    if(err){
      res.send(err);
    } else {
      res.render('attachcredit', {
        title : 'Attach Credit',
        "credit_target" : Id1,
        "crewlist" : crew,
        "origin" : "credit"
      });
    }
  });
});

router.get('/attach/tocrew/:crewID', function(req, res){
  var Id1 = req.params.crewID;

  CreditModel.find({}, '_id name', function(err, credits){
    if(err){
      res.send(err);
    } else {
      res.render('attachcredit', {
        title : 'Attach Credit',
        "crew_target" : Id1,
        "creditlist" : credits,
        "origin" : "crew"
      });
    }
  });
});

router.post('/attachcomplete', function(req, res){
  var crewmember = req.body.crewmember;
  console.log(crewmember);
  var credit = req.body.credit;
  console.log(credit);

  CrewModel.updateOne({ _id: crewmember }, { "$push": { "credits": credit } }, function(err, raw){
    if(err){
      res.send(err);
    } else {
      CreditModel.updateOne({ _id: credit }, { "$push": { "crew_id": crewmember } }, function(err, raw){
        if(err){
          res.send(err);
        } else {
          res.redirect('/credits/credit/'+credit);
        }
      });
    }
  });
});

module.exports = router;
