const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  comments: {
    type: [String],
    deafult: [],
  },
  commentcount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('books', bookSchema);