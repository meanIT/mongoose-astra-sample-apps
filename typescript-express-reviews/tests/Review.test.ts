import Review from '../src/models/review';
import Vehicle from '../src/models/vehicle';
import User from '../src/models/user';
import { describe, it, before } from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import create from '../src/api/Review/create';
import findByVehicle from '../src/api/Review/findByVehicle';

interface ResponseStub {
  status: sinon.SinonStub;
  json: sinon.SinonStub;
}

describe('Review', function() {
  it('should create a review', async function() {
    this.timeout(10000);
    const mockRequest = (body) => ({
      body
    });
    const mockResponse = (): ResponseStub => {
      const res: ResponseStub = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      return res;
    };
    const [user] = await User.insertMany([{
      email: 'test@localhost.com',
      firstName: 'Test',
      lastName: 'Testerson'
    }]);
    const [vehicle] = await Vehicle.insertMany([
      {
        make: 'Tesla',
        model: 'Model S',
        year: 2022,
        images: [
          'https://tesla-cdn.thron.com/delivery/public/image/tesla/6139697c-9d6a-4579-837e-a9fc5df4a773/bvlatuR/std/1200x628/Model-3-Homepage-Social-LHD',
          'https://www.tesla.com/sites/default/files/images/blogs/models_blog_post.jpg'
        ],
        numReviews: 0,
        averageReview: 0
      }
    ]);
    const req = mockRequest({
      vehicleId: vehicle.id.toString(),
      userId: user.id,
      rating: 4,
      text: 'The length of this text must be greater than 30 to pass validation.'
    });
    const res = mockResponse();
    await create(req, res);
    assert(res.json.getCall(0).args[0].review);
    assert.equal(res.json.getCall(0).args[0].review.rating, 4);
    assert.equal(res.json.getCall(0).args[0].review.text, 'The length of this text must be greater than 30 to pass validation.');
  });

  it('Should find all the reviews for the given vehicleId, adhering to the skip and limit parameters', async function() {
    const mockRequest = (query) => ({ query });
    const mockResponse = (): ResponseStub => {
      const res: ResponseStub = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      return res;
    };
    const [user] = await User.insertMany([{
      email: 'test@localhost.com',
      firstName: 'Test',
      lastName: 'Testerson'
    }]);
    const [vehicle] = await Vehicle.insertMany([
      {
        make: 'Tesla',
        model: 'Model S',
        year: 2022,
        images: [
          'https://tesla-cdn.thron.com/delivery/public/image/tesla/6139697c-9d6a-4579-837e-a9fc5df4a773/bvlatuR/std/1200x628/Model-3-Homepage-Social-LHD',
          'https://www.tesla.com/sites/default/files/images/blogs/models_blog_post.jpg'
        ],
        numReviews: 0,
        averageReview: 0
      },
    ]);
    for (let i = 0; i < 6; i++) {
      await Review.create({
        rating: i > 5 ? 5 : i, 
        text: 'This is a review that must have length greater than 30. ' + i, 
        vehicleId: vehicle.id,
        userId: user.id
      });
    }
    vehicle.numReviews = 6;
    vehicle.averageReview = 3;
    await vehicle.save();
    // TODO: skip doesn't work against tables yet
    const req = mockRequest({ vehicleId: vehicle.id.toString(), limit: 3, skip: 0 });
    const res = mockResponse();
    await findByVehicle(req, res);

    const reviews = res.json.getCall(0).args[0].reviews;
    assert.equal(reviews.length, 3);
    assert.deepEqual(
      reviews.map((r: typeof Review) => r.rating),
      [5, 4, 3]
    );

    // Test that populate worked
    assert.equal(reviews[0].vehicle.make, 'Tesla');
    assert.equal(reviews[0].vehicle.model, 'Model S');

    assert.equal(reviews[0].user.firstName, 'Test');
    assert.equal(reviews[0].user.lastName, 'Testerson');
  });
});
