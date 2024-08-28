import express, { Request, Response } from 'express';
import Review from '../../models/review';

async function findByVehicle (request: Request, response: Response): Promise<void> {
  let limit = 5;
  if (request.query?.limit != null) {
    limit = parseInt(request.query.limit.toString(), 10) || 5;
  }
  let skip = 0;
  if (request.query?.skip != null) {
    skip = parseInt(request.query.skip.toString(), 10) || 0;
  }

  const vehicleId: string | null = typeof request.query.vehicleId === 'string' ? request.query.vehicleId : null;
  if (vehicleId == null) {
    throw new Error('vehicleId must be a string');
  }

  const reviews = await Review.
    find({ vehicleId }).
    sort({ createdAt: -1 }).
    skip(skip).
    limit(limit).
    //populate('user').
    //populate('vehicle').
    setOptions({ sanitizeFilter: true });
  response.status(200).json({ reviews: reviews });
  return;
};

export default findByVehicle;