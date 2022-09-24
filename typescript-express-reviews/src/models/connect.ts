import mongoose from './mongoose';
import { createStargateUri } from 'stargate-mongoose/dist/collections/utils';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV;

if (env) {
  dotenv.config({
    path: path.resolve(path.join(__dirname, '..', '..'), `.env.${env.toLowerCase()}`)
  });
} else {
  dotenv.config();
}

export default async function connect() {
  const stargateUri = await createStargateUri(
    process.env.STARGATE_BASE_URL,
    process.env.STARGATE_AUTH_URL,
    'test',
    process.env.STARGATE_USERNAME,
    process.env.STARGATE_PASSWORD
  );

  await mongoose.connect(stargateUri, {
    autoCreate: false,
    autoIndex: false
  });
}


