'use strict';

require('dotenv').config({ path: `${__dirname}/../.env.test` });

const Bot = require('../models/bot');
const { after, before } = require('mocha');
const mongoose = require('../mongoose');

const uri = process.env.DATA_API_URI;
const jsonApiConnectOptions = {
  username: process.env.DATA_API_AUTH_USERNAME,
  password: process.env.DATA_API_AUTH_PASSWORD
};

before(async function() {
  this.timeout(30000);
  await mongoose.connect(uri, jsonApiConnectOptions);

  const docs = await Bot.find({});
  for (const doc of docs) {
    await Bot.deleteOne({ id: doc.id });
  }
});

after(async function() {
  await mongoose.disconnect();
});