'use strict';

require('dotenv').config({ path: `${__dirname}/../.env.test` });

require('../server/models/Category');
require('../server/models/Photo');
require('../server/models/PhotoEmbedding');

const { before, after } = require('mocha');
const connect = require('../server/models/connect');
const mongoose = require('../server/models/mongoose');
const { tableDefinitionFromSchema } = require('stargate-mongoose');

before(async function() {
  this.timeout(30000);
  await connect();
  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.namespace);
  }
  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.dropTable('categories');
    await mongoose.connection.dropTable('photos');
    await mongoose.connection.dropTable('photoembeddings');
    await mongoose.connection.createTable('categories', tableDefinitionFromSchema(mongoose.model('category').schema));
    await mongoose.connection.createTable('photos', tableDefinitionFromSchema(mongoose.model('photo').schema));
    await mongoose.connection.collection('photos').createVectorIndex('photosvector', 'vector');
    await mongoose.connection.createTable('photoembeddings', tableDefinitionFromSchema(mongoose.model('photoembedding').schema));
    await mongoose.connection.collection('photoembeddings').createVectorIndex('photoembeddingsvector', 'vector');
  } else {
    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.deleteMany({})));
  }
});

after(async function() {
  this.timeout(30000);
  if (!process.env.DATA_API_TABLES) {
    await Promise.all(Object.values(mongoose.connection.models).map(async Model => {
      await mongoose.connection.dropCollection(Model.collection.collectionName);
    }));
  }

  await mongoose.disconnect();
});
