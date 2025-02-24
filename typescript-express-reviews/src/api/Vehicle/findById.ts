import express, { Request, Response } from 'express';
import Review from '../../models/review';
import User from '../../models/user';
import Vehicle from '../../models/vehicle';

type ReviewDocument = ReturnType<(typeof Review)['hydrate']>;
type UserDocument = ReturnType<(typeof User)['hydrate']>;
type VehicleDocument = ReturnType<(typeof Vehicle)['hydrate']>;

async function last5(request: Request, response: Response): Promise<void> {
  let limit = 5;
  if (request.query?.limit != null) {
    limit = parseInt(request.query.limit.toString(), 10);
  }

  const vehicleId: string | null = typeof request.query._id === 'string' ? request.query._id : null;
  if (vehicleId == null) {
    throw new Error('vehicleId must be a string');
  }

  const vehicle = await Vehicle.
    findById({ _id: request.query?._id }).
    setOptions({ sanitizeFilter: true });
  const reviews = await Review.
    find<ReviewDocument & { user?: UserDocument, vehicle?: VehicleDocument }>({ vehicleId: vehicleId }).
    sort({ createdAt: -1 }).
    limit(limit).
    //populate('user').
    //populate('vehicle').
    setOptions({ sanitizeFilter: true });

  // TODO: populate doesn't work against tables because lack of $in (see stargate/data-api#1446)
  for (const review of reviews) {
    review.user = await User.findOne({ _id: review.userId }).orFail();
    review.vehicle = await Vehicle.findOne({ _id: review.vehicleId }).orFail();
  }

  response.status(200).json({
    vehicle: vehicle,
    reviews: reviews
  });
}

export default last5;
