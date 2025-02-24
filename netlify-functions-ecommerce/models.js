'use strict';

const mongoose = require('./mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema);

module.exports.Product = Product;

const orderSchema = new mongoose.Schema({
  items: {
    // `items` is stored as an array of JSON strings for compatibility with Data API tables, which do not
    // support lists of objects currently.
    type: [{
      type: String,
      get(v) {
        return v == null ? v : JSON.parse(v);
      },
      set(v) {
        if (v == null) {
          return v;
        }
        return typeof v === 'string' ? v : JSON.stringify(v);
      }
    }]
  },
  total: {
    type: Number,
    default: 0
  },
  name: {
    type: String
  },
  paymentMethod: {
    id: String,
    brand: String,
    last4: String
  }
}, { versionKey: false });

const Order = mongoose.model('Order', orderSchema);

module.exports.Order = Order;

const cartSchema = new mongoose.Schema({
  items: {
    // `items` is stored as an array of JSON strings for compatibility with Data API tables, which do not
    // support lists of objects currently.
    type: [{
      type: String,
      get(v) {
        return v == null ? v : JSON.parse(v);
      },
      set(v) {
        if (v == null) {
          return v;
        }
        return typeof v === 'string' ? v : JSON.stringify(v);
      }
    }]
  },
  orderId: { type: mongoose.ObjectId, ref: 'Order' },
  total: Number,
  stripeSessionId: { type: String }
}, { versionKey: false, timestamps: false, toObject: { getters: true }, toJSON: { getters: true } });

cartSchema.virtual('numItems').get(function numItems() {
  if (this.items == null) {
    return 0;
  }
  const items = this.items.map(item => {
    if (typeof item === 'string') {
      return JSON.parse(item);
    }
    return item;
  });
  return items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;

