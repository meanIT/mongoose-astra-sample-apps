import mongoose from './mongoose';

const imagesSchemaType = new mongoose.Schema.Types.Array('images', { type: [String] });

const schema = new mongoose.Schema({
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    validate: (v: number) => Number.isInteger(v) && v >= 1950
  },
  images: [String],
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  averageReview: {
    type: Number,
    required: true,
    default: 0
  }
}, { versionKey: false });

const Vehicle = mongoose.model('Vehicle', schema);

export default Vehicle;
