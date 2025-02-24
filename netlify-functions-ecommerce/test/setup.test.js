'use strict';

require('../config');

const { after, before } = require('mocha');
const connect = require('../connect');
const models = require('../models');
const mongoose = require('../mongoose');
const { tableDefinitionFromSchema } = require('stargate-mongoose');

if (process.env.DATA_API_TABLES) {
  console.log('Testing Data API tables');
}

before(async function() {
  this.timeout(60000);
  await connect();

  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.namespace);
  }

  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.dropTable('products');
    await mongoose.connection.dropTable('orders');
    await mongoose.connection.dropTable('carts');

    await mongoose.connection.createTable('products', tableDefinitionFromSchema(models.Product.schema));
    await mongoose.connection.createTable('orders', tableDefinitionFromSchema(models.Order.schema));
    await mongoose.connection.createTable('carts', tableDefinitionFromSchema(models.Cart.schema));
  } else {
    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.deleteMany({})));
  }
});

after(async function() {
  await mongoose.disconnect();
});
