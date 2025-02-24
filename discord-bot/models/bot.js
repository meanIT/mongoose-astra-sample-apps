'use strict';

const mongoose = require('../mongoose');

const botSchema = new mongoose.Schema({
  name: String
}, { versionKey: false });

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;