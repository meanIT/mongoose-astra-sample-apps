'use strict';

require('./config');

const mongoose = require('./mongoose');

require('./models');
const { createAstraUri } = require('stargate-mongoose');

let conn = null;

module.exports = async function connect() {
  if (conn != null) {
    return conn;
  }
  conn = mongoose.connection;
  let uri = '';
  let jsonApiConnectOptions = {};
  if (process.env.IS_ASTRA === 'true') {
    uri = createAstraUri(
      process.env.ASTRA_API_ENDPOINT,
      process.env.ASTRA_APPLICATION_TOKEN,
      process.env.ASTRA_NAMESPACE
    );
    jsonApiConnectOptions = {
      isAstra: true,
      level: 'fatal'
    };
  } else {
    uri = process.env.DATA_API_URI;
    const featureFlags = process.env.DATA_API_TABLES ? ['Feature-Flag-tables'] : [];
    jsonApiConnectOptions = {
      username: process.env.DATA_API_AUTH_USERNAME,
      password: process.env.DATA_API_AUTH_PASSWORD,
      authUrl: process.env.DATA_API_AUTH_URL,
      featureFlags,
      level: 'fatal'
    };
  }
  await mongoose.connect(uri, jsonApiConnectOptions);
  
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.init()));
  return conn;
};
