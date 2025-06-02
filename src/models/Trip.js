import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Trip code is required.'],
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Trip name is required.'],
    index: true,
  },
  length: {
    type: String,
    required: [true, 'Trip length is required.'],
  },
  start: {
    type: Date,
    required: [true, 'Start date is required.'],
  },
  resort: {
    type: String,
    required: [true, 'Resort name is required.'],
  },
  perPerson: {
    type: String, // Kept as String to match original, consider Number for calculations
    required: [true, 'Price per person is required.'],
  },
  image: {
    type: String,
    required: [true, 'Image name/URL is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
});

// Ensure the model is not re-compiled if it already exists
export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);