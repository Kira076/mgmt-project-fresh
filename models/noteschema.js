var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  created: { type: Date, required: true, index: true },
  name: { type: String, required: true, index: true },
  contents: { type: String, required: true }
});

var NoteModel = mongoose.model('Note', NoteSchema);

module.exports = NoteModel;
