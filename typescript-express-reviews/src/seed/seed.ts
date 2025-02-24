import dotenv from 'dotenv';
dotenv.config();

import connect from '../models/connect';
import mongoose from '../models/mongoose';

import Authentication from '../models/authentication';
import Review from '../models/review';
import User from '../models/user';
import Vehicle from '../models/vehicle';
import bcrypt from 'bcryptjs';
import { driver, tableDefinitionFromSchema } from 'stargate-mongoose';

import util from 'util';
util.inspect.defaultOptions.depth = 6;

run().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function run() {
  await connect();
  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.namespace as string);
  }

  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.dropTable('authentications');
    await mongoose.connection.dropTable('reviews');
    await mongoose.connection.dropTable('users');
    await mongoose.connection.dropTable('vehicles');

    await mongoose.connection.createTable('authentications', tableDefinitionFromSchema(Authentication.schema));
    await mongoose.connection.createTable('reviews', tableDefinitionFromSchema(Review.schema));
    await mongoose.connection.createTable('users', tableDefinitionFromSchema(User.schema));
    await mongoose.connection.createTable('vehicles', tableDefinitionFromSchema(Vehicle.schema));
  } else {
    const existingCollections = await mongoose.connection.listCollections()
      .then(collections => collections.map(c => c.name));

    for (const Model of Object.values(mongoose.connection.models)) {
      // First ensure the collection exists
      if (!existingCollections.includes(Model.collection.collectionName)) {
        console.log('Creating collection', Model.collection.collectionName);
        await mongoose.connection.createCollection(Model.collection.collectionName);
      } else {
        console.log('Resetting collection', Model.collection.collectionName);
      }
      // Then make sure the collection is empty
      await Model.deleteMany({});
    }
  }

  const users = await User.insertMany([
    {
      firstName: 'Dominic',
      lastName: 'Toretto',
      email: 'dom@fastandfurious.com'
    },
    {
      firstName: 'Brian',
      lastName: 'O\'Connor',
      email: 'brian@fastandfurious.com'
    }
  ]);
  for (let i = 0; i < users.length; i++) {
    await Authentication.insertMany([{
      type: 'password',
      userId: users[i].id,
      secret: await bcrypt.hash(users[i].firstName.toLowerCase(), 10)
    }]);
  }
  const vehicles = await Vehicle.insertMany([
    {
      _id: '0'.repeat(24),
      make: 'Tesla',
      model: 'Model S',
      year: 2022,
      images: [
        'https://tesla-cdn.thron.com/delivery/public/image/tesla/6139697c-9d6a-4579-837e-a9fc5df4a773/bvlatuR/std/1200x628/Model-3-Homepage-Social-LHD',
        'https://www.tesla.com/sites/default/files/images/blogs/models_blog_post.jpg'
      ],
      numReviews: 0,
      averageReviews: 0
    },
    {
      _id: '1'.repeat(24),
      make: 'Porsche',
      model: 'Taycan',
      year: 2022,
      images: [
        'https://www.motortrend.com/uploads/sites/5/2020/02/2020-Porsche-Taycan-Turbo-S-Track-Ride-5.gif?fit=around%7C875:492',
        'https://newsroom.porsche.com/.imaging/mte/porsche-templating-theme/image_1290x726/dam/pnr/2021/Products/Free-Software-Update-Taycan/Free-Software-Update-for-early-Porsche-Taycan_2.jpeg/jcr:content/Free%20Software-Update%20for%20early%20Porsche%20Taycan_2.jpeg'
      ],
      numReviews: 0,
      averageReviews: 0
    }
  ]);

  await Review.insertMany([
    {
      vehicleId: vehicles[1].id,
      userId: users[0].id,
      text: 'When you live your life a quarter of a mile at a time, it ain\'t just about being fast. I needed a 10 second car, and this car delivers.',
      rating: 4
    },
    {
      vehicleId: vehicles[0].id,
      userId: users[1].id,
      text: 'I need NOS. My car topped out at 140 miles per hour this morning.',
      rating: 3
    }
  ]);

  console.log('Done');
}
