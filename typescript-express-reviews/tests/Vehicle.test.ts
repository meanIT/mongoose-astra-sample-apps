
import Vehicle from '../src/models/vehicle';
import Review from '../src/models/review';
import User from '../src/models/user';
import { describe, it } from 'mocha';
import findById from '../src/api/Vehicle/findById';
import assert from 'assert';
import sinon from 'sinon';

interface ResponseStub {
  status: sinon.SinonStub;
  json: sinon.SinonStub;
}

describe('Vehicle', function() {
  it('should find a vehicle with its last 5 reviews', async function() {
    this.timeout(10000);

    const mockRequest = (query) => ({
      query
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
    for (let i = 1; i < 7; i++) {
      await Review.create({
        rating: i > 5 ? 5 : i,
        text: 'This is a review that must have length greater than 30. ' + i,
        vehicleId: vehicle._id,
        userId: user._id
      });
    }
    vehicle.numReviews = 5;
    vehicle.averageReview = 3;
    await vehicle.save();
    const req = mockRequest({ _id: vehicle.id.toString(), limit: 5 });
    const res = mockResponse();
    await findById(req, res);
    assert(res.json.getCall(0).args[0].vehicle);

    const reviews = res.json.getCall(0).args[0].reviews;
    assert.equal(reviews.length, 5);
    assert.deepEqual(
      reviews.map((r: typeof Review) => r.rating),
      [5, 5, 4, 3, 2]
    );
    
    // Test that populate worked
    assert.equal(reviews[0].vehicle.make, 'Tesla');
    assert.equal(reviews[0].vehicle.model, 'Model S');

    assert.equal(reviews[0].user.firstName, 'Test');
    assert.equal(reviews[0].user.lastName, 'Testerson');
  });

  
});
