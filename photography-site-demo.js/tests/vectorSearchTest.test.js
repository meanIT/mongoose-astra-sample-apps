'use strict';

const { describe, it } = require('mocha');
const assert = require('assert');

const Photo = require('../server/models/Photo');

const vectorKey = process.env.DATA_API_TABLES ? 'vector' : '$vector';

describe('Vector Search Tests', function() {
  it('Photo Text Embedding Test', async function() {

    // Generate 768 random float numbers between 0 and 1
    const targetVector = Array.from({ length: 768 }, () => Math.random());

    const photo1 = new Photo({
      name: 'testName1',
      description: 'A free and happy bird is flying upon the sky',
      category: 'landscape',
      image: 'testImage1',
      [vectorKey]: targetVector
    });
    await photo1.save();

    const photo2 = new Photo({
      name: 'testName2',
      description: 'These violent delights have violent ends',
      category: 'landscape',
      image: 'testImage2',
      [vectorKey]: Array.from({ length: 768 }, () => Math.random())
    });
    await photo2.save();

    //should find photo1, since its vector is the same with targetVector
    const photo = await Photo.find({}).sort({ [vectorKey]: { $meta: targetVector } }).limit(1);
    assert.equal(photo[0].name, 'testName1');

  });

});
