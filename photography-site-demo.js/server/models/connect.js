'use strict';

require('dotenv').config();
const mongoose = require('./mongoose');
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
      isAstra: true
    };
  } else {
    uri = process.env.JSON_API_URL;
    jsonApiConnectOptions = {
      username: process.env.JSON_API_AUTH_USERNAME,
      password: process.env.JSON_API_AUTH_PASSWORD,
      authUrl: process.env.JSON_API_AUTH_URL
    };
  }
  await mongoose.connect(uri, jsonApiConnectOptions);
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.init()));
  return conn;
};