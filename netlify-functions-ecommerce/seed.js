'use strict';

require('./config');

const models = require('./models');
const connect = require('./connect');
const mongoose = require('./mongoose');
const { tableDefinitionFromSchema } = require('stargate-mongoose');

async function createProducts() {
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
    const existingCollections = await mongoose.connection.listCollections()
      .then(collections => collections.map(c => c.name));
    for (const Model of Object.values(models)) {
      if (existingCollections.includes(Model.collection.collectionName)) {
        continue;
      }
      console.log('Creating', Model.collection.collectionName);
      await Model.createCollection();
    }
    await Promise.all(
      Object.values(models).map(Model => Model.deleteMany({}))
    );
  }

  const { Product } = models;

  await Product.insertMany([
    {
      name: 'iPhone 12',
      price: 499,
      image: '/images/iphone-12.png',
      description: '5G speed. A14 Bionic, the fastest chip in a smartphone. The iPhone 12 features Super Retina XDR display with a 6.1‐inch edge-to-edge OLED display, MagSafe wireless charging, Ceramic Shield with four times better drop performance and Night mode on every camera as well as Ultra Wide and Wide cameras.'
    },
    {
      name: 'iPhone SE',
      price: 429,
      image: '/images/iphone-se.png',
      description: 'The new iPhone SE delivers best-in-class performance and great photos for an affordable price, if you can live with a small screen'
    },
    {
      name: 'iPhone 12 Pro',
      price: 799,
      image: '/images/iphone-12-pro.png',
      description: 'Shoot amazing videos and photos with the Ultra Wide, Wide, and Telephoto cameras. Capture your best low-light photos with Night mode. Watch HDR movies and shows on the Super Retina XDR display—the brightest iPhone display yet. Experience unprecedented performance with A13 Bionic for gaming, augmented reality (AR), and photography. And get all-day battery life and a new level of water resistance. All in the first iPhone powerful enough to be called Pro.'
    },
    {
      name: 'iPhone 11',
      price: 300,
      image: '/images/iphone-11.png',
      description: 'The iPhone 11 offers superb cameras, fast performance and excellent battery life for an affordable price'
    }
  ]);

  const products = await Product.find();
  console.log('done', products.length, products);
  process.exit(0);
}

createProducts();
