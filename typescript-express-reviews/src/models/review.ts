import mongoose from './mongoose';

const schema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId()
  },
  rating: {
    type: Number,
    required: true,
    validate: (v: number) => Number.isInteger(v)
  },
  text: {
    type: String,
    required: true,
    validate: (v: string) => v.length >= 30
  },
  userId: {
    type: 'ObjectId',
    required: true
  },
  vehicleId: {
    type: 'ObjectId',
    required: true
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  },
  updatedAt: {
    type: Number,
    default: () => Date.now()
  }
}, { _id: false, versionKey: false, timestamps: true });

schema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: 'id',
  justOne: true
});

schema.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'vehicleId',
  foreignField: 'id',
  justOne: true
});

schema.pre('save', async function updateVehicleRating() {
  if (!this.isNew) {
    return;
  }
  const vehicle = await mongoose.model('Vehicle').findOne({ id: this.vehicleId }).orFail();
  vehicle.numReviews += 1;
  const vehicleReviews = await mongoose.model('Review').find({ vehicle_id: this.vehicleId });
  const reviewRatings = vehicleReviews.map((entry) => entry.rating);
  reviewRatings.push(this.rating);
  const average = calculateAverage(reviewRatings);
  vehicle.averageReview = average;
  await vehicle.save();
});

function calculateAverage(ratings: number[]) {
  if (ratings.length === 0) {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < ratings.length; i++) {
    sum += ratings[i];
  }
  const average = sum / ratings.length;
  return average;
}

const Review = mongoose.model('Review', schema);

export default Review;
