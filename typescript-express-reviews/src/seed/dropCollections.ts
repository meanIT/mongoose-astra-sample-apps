import dotenv from 'dotenv';
dotenv.config();

import connect from '../models/connect';
import mongoose from '../models/mongoose';
import type { driver } from 'stargate-mongoose';

dropCollections().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function dropCollections() {
  await connect();

  const collections = await mongoose.connection.listCollections();
  for (const collection of collections) {
    console.log('Dropping collection', collection.name);
    await mongoose.connection.dropCollection(collection.name);
  }

  const tables = await mongoose.connection.listTables();
  for (const table of tables) {
    console.log('Dropping table', table.name);
    await mongoose.connection.dropTable(table.name);
  }

  console.log('Done');
  process.exit(0);
}
