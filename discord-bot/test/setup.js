'use strict';

require('dotenv').config({ path: `${__dirname}/../.env.test` });

const Bot = require('../models/bot');
const { after, before } = require('mocha');
const mongoose = require('../mongoose');

const { tableDefinitionFromSchema } = require('stargate-mongoose');

const uri = process.env.DATA_API_URI;
const jsonApiConnectOptions = {
  username: process.env.DATA_API_AUTH_USERNAME,
  password: process.env.DATA_API_AUTH_PASSWORD
};
if (process.env.DATA_API_TABLES) {
  console.log('Testing Data API tables');
}

before(async function() {
  this.timeout(30000);
  await mongoose.connect(uri, jsonApiConnectOptions);

  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.namespace);
  }
  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.dropTable('bots');
    await mongoose.connection.createTable('bots', tableDefinitionFromSchema(Bot.schema));
  } else {
    await Bot.createCollection();
  }

  const docs = await Bot.find({});
  for (const doc of docs) {
    await Bot.deleteOne({ _id: doc._id });
  }
});

after(async function() {
  await mongoose.disconnect();
});
