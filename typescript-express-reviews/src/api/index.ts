import dotenv from 'dotenv';
dotenv.config();

import { addAsync } from '@awaitjs/express';
import express from 'express';
import register from './User/register';
import login from './User/login';
import create from './Review/create';
import findById from './Vehicle/findById';
import findByVehicle from './Review/findByVehicle';
import bodyParser from 'body-parser';
import connect from '../models/connect';

import studio from '@mongoosejs/studio';

const port = process.env.PORT || 3000;

void async function main() {
  const app = addAsync(express());

  // Pretty JSON responses because this app doesn't have a frontend yet
  app.set('json spaces', 2);

  await connect();

  app.use(bodyParser.json());
  app.get('/status', function(req: express.Request, res: express.Response) {
    res.json({ ok: 1 });
  });

  app.putAsync('/register', register);
  app.putAsync('/login', login);
  app.postAsync('/review/create', create);
  app.getAsync('/vehicle/find-by-id', findById);
  app.getAsync('/review/find-by-vehicle', findByVehicle);

  app.use('/studio', studio.express('/studio/api'));
  console.log('Mongoose Studio mounted on /studio');

  await app.listen(port);
  console.log('Listening on port ' + port);
}();
