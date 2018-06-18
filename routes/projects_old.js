var express = require('express');
var router = express.Router();

router.get('/projlist', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/mydb';

  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect to the server', err);
    } else {
      console.log('Connection Established');

      var collection = db.db("test").collection('projects');

      collection.find({}).toArray(function(err, result){
        if(err){
          res.send(err);
        } else if(result.length){
          res.render('projlist', {
            "projlist" : result
          });
        } else {
          res.send('No documents found');
        }

        db.close();
      });
    }
  });
});

router.get('/newproj', function(req, res){
  res.render('newproject', {title: 'Add Project'});
});

router.post('/addproj', function(req, res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/mydb';

  MongoClient.connect(url, function(err, db){
    if (err){
      console.log("Unable to connect to server", err);
    } else {
      console.log('Connected to server');

      var collection = db.db("test").collection('projects');
      var proj1 = {name: req.body.proj_name, director: req.body.director, start_date: req.body.start_date, id: req.body.proj_id};

      collection.insert(proj1, function(err, result){
        if(err){
          console.log(err);
        } else {
          res.redirect('projlist');
        }
        db.close();
      });
    }
  });
});

router.get('/episodes/:projName', function(req, res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/mydb';
  var name1 = req.params.projName;

  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect to the server', err);
    } else {
      console.log('Connection Established');

      var collection = db.db("test").collection('projects');

      collection.find({name: name1}).toArray(function(err, result){
        if(err){
          res.send(err);
        } else if(result.length){
          console.log(result);
          res.render('episode', {
            "episode" : result
          });
        } else {
          res.send('No documents found');
        }

        db.close();
      });
    }
  });
});

module.exports = router;
