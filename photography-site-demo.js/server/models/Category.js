'use strict';

const mongoose = require('./mongoose.js');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  }
});

module.exports = mongoose.model('category', categorySchema);
