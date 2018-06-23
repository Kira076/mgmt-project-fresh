var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  created: { type: Date, required: true, index: true },
  name: { type: String, required: true, index: true },
  contents: { type: String, required: true }
});

NoteSchema.pre('remove', function(next){
  var note = this;
  note.model('Stage').update({ notes: note._id }, { $pull: { notes: note._id } }, { multi: true }).exec()
  .then(function(result){
    return note.model('Project').update({ notes: note._id }, { $pull: { notes: note._id } }, { multi: true }).exec();
  })
  .then(function(result){
    return note.model('Crew').update({ notes: note._id }, { $pull: { notes: note._id } }, { multi: true }).exec();
  })
  .then(function(result){
    return note.model('Credit').update({ notes: note._id }, { $pull: { notes: note._id } }, { multi: true }).exec();
  })
  .catch(function(err){
    next(err);
  });
  next();
});

var NoteModel = mongoose.model('Note', NoteSchema);

module.exports = NoteModel;
