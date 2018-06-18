var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

module.exports = router;
