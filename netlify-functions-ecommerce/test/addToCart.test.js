'use strict';

const { describe, it } = require('mocha');
const assert = require('assert');
const { handler: addToCart } = require('../netlify/functions/addToCart');
const fixtures = require('../test/fixtures');
const mongoose = require('../mongoose');

describe('Add to Cart', function() {
  this.timeout(10000);

  it('Should create a cart and add a product to the cart', async function() {
    const products = await fixtures.createProducts({
      product: [
        { name: 'A Test Products', price: 500 },
        { name: 'Another Test Product', price: 600 }
      ]
    }).then((res) => res.products);
    const params = {
      body: {
        cartId: null,
        items: [
          { productId: products[0]._id, quantity: 2 },
          { productId: products[1]._id, quantity: 1 }
        ]
      }
    };
    params.body = JSON.stringify(params.body);
    const result = await addToCart(params);
    try {
      result.body = JSON.parse(result.body);
    } catch (error) {
      throw new Error(`Error parsing response as JSON: ${result.body}`);
    }
    assert(result.body);
    assert(result.body.items.length);
  });

  it('Should find the cart and add to the cart', async function() {
    const products = await fixtures.createProducts({ product: [{ productName: 'A Test Products', productPrice: 500 }, { productName: 'Another Test Product', productPrice: 600 }] })
      .then((res) => res.products);
    const { cart } = await fixtures.createCart({ products: [] });
    const params = {
      body: {
        cartId: cart._id,
        items: [
          { productId: products[0]._id, quantity: 2 },
          { productId: products[1]._id, quantity: 1 }
        ]
      }
    };
    params.body = JSON.stringify(params.body);
    const findCart = await addToCart(params);
    try {
      findCart.body = JSON.parse(findCart.body);
    } catch (error) {
      throw new Error(`Error parsing response as JSON: ${findCart.body}`);
    }
    assert(findCart.body);
    assert.equal(findCart.body.items.length, 2);
  });

  it('Should find the cart and increase the quantity of the item(s) in the cart', async function() {
    const products = await fixtures.createProducts({ product: [{ productName: 'A Test Products', productPrice: 500 }, { productName: 'Another Test Product', productPrice: 600 }] })
      .then((res) => res.products);
    const { cart } = await fixtures.createCart({ products: [] });
    const params = {
      body: {
        cartId: cart._id,
        items: [
          { productId: products[0]._id, quantity: 2 },
          { productId: products[1]._id, quantity: 1 }
        ]
      }
    };
    params.body = JSON.stringify(params.body);
    const findCart = await addToCart(params);
    try {
      findCart.body = JSON.parse(findCart.body);
    } catch (error) {
      throw new Error(`Error parsing response as JSON: ${findCart.body}`);
    }
    assert(findCart.body);
    assert.equal(findCart.body.items.length, 2);
    assert.equal(findCart.body.items[0].quantity, 2);
    assert.equal(findCart.body.items[1].quantity, 1);
    params.body = JSON.stringify(params.body);

    const updateCart = await addToCart(params);
    updateCart.body = JSON.parse(updateCart.body);
    assert(updateCart.body);
    assert.equal(updateCart.body.items.length, 2);
    assert.equal(updateCart.body.items[0].quantity, 4);
    assert.equal(updateCart.body.items[1].quantity, 2);
  });
});
