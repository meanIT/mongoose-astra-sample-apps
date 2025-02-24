'use strict';

const { describe, it } = require('mocha');
const assert = require('assert');
const Category = require('../server/models/Category');

describe('Category test', function() {
  it('Create landscape category, then find it', async function() {
    await Category.create({
      name: 'landscape',
      image: 'test.png'
    });
    const testCategory = await Category.find({ name: 'landscape' });
    assert.equal(testCategory.length, 1);
    assert.equal(testCategory[0].name, 'landscape');
    assert.equal(testCategory[0].image, 'test.png');
  });

  it('Create another category, then find all categories', async function() {
    await Category.create({
      name: 'animal',
      image: 'test.png'
    });
    const testCategory = await Category.find({ name: 'animal' });
    assert.equal(testCategory.length, 1);
    assert.equal(testCategory[0].name, 'animal');
    assert.equal(testCategory[0].image, 'test.png');
  });

});
