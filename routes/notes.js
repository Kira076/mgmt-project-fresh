var express = require('express');
var router = express.Router();
var db = require('../db');
var CrewModel = require('../models/crewschema');
var ProjectModel = require('../models/projectschema');
var StageModel = require('../models/stageschema');
var CreditsModel = require('..models/creditschema');
var NotesModel = require('../models/noteschema');

router.get('/:noteID', function(req, res){
  var Id1 = req.params.noteID;

  NotesModel.findOne({ _id: Id1 }, function(err, note){
    if(err){
      res.send(err);
    } else {
      res.render('note', {
        "data" : note
      });
    }
  });
});

router.get('/new/crew/:crewID', function(req, res){
  var Id1 = req.params.crewID;

  res.render('newnote', {
    title: 'Add Note',
    type: 'crew',
    "target" : Id1
  });
});

router.get('/new/credits/:creditID', function(req, res){
  var Id1 = req.params.creditID;

  res.render('newnote', {
    title: 'Add Note',
    type: 'credit',
    "target" : Id1
  });
});

router.get('/new/projects/:projectID', function(req, res){
  var Id1 = req.params.projectID;

  res.render('newnote', {
    title: 'Add Note',
    type: 'project',
    "target" : Id1
  });
});

router.get('/new/stage/:stageID', function(req, res){
  var Id1 = req.params.stageID;

  res.render('newnote', {
    title: 'Add Note',
    type: 'stage',
    "target" : Id1
  });
});

router.get('/delete/:noteID', function(req, res){
  var Id1 = req.params.noteID;
  NoteModel.deleteOne({ _id: Id1 }, function(err){
    if(err){
      console.log(err);
    } else {
      res.render('notedeleted');
    }
  });
});

router.post('/add', function(req, res){
  var note1 = new NoteModel({
    created: req.body.created,
    name: req.body.name,
    contents: req.body.contents,
  });

  var type;
  var refer;

  if(req.body.type == 'crew'){
    type = CrewModel;
  } else if(req.body.type == 'credit') {
    type = CreditModel;
  } else if(req.body.type == 'project') {
    type = ProjectModel;
  } else if(req.body.type == 'stage') {
    type = StageModel;
  }

  type.updateOne({ _id: req.body.target }, { "$push": { "notes": note1._id } }, function(err, raw){
    if(err){
      res.send(err);
    } else {
      note1.save(function(err){
        if(err){
          res.send(err);
        } else {
          res.redirect('/'+note1._id);
        }
      });
    }
  });
});

module.exports = router;
