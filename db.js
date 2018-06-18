//Import Mongoose module
var mongoose = require('mongoose');

var state = {
  db: null,
}

exports.connect = function(url){
  if (state.db) return ; //If there's already a database connection then finish

  mongoose.connect(url); //Connect to supplied url
  mongoose.Promise = global.Promise; //Get mongoose to use global promise
  var db = mongoose.connection; //Get the connection as an object

  db.on('error', console.error.bind(console, 'Mongoose connection error: ')); //If there's a error while connecting, display it
  //Once the connection is established, save the connection object to the state and finish
  db.once('open', function(){
    state.db = db;
  });
}

exports.get = function(){
  return state.db; //Return the connection object
}

//If there's a valid connection, close it down and reset the state variable to an inactive state then finish
exports.close = function(){
  if (state.db) {
    state.db.close(function(err, result){
      state.db = null;
      state.mode = null;
    });
  }
}
