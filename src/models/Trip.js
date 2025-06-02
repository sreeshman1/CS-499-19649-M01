const mongoose = require('mongoose');

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
  durationNights: { 
    type: Number,
    required: [true, 'Duration in nights is required.'],
    min: [1, 'Duration must be at least 1 night.'],
  },
  start: {
    type: Date,
    required: [true, 'Start date is required.'],
  },
  resort: { 
    type: String,
    required: [true, 'Resort name is required.'],
  },
  rating: { 
    type: Number,
    required: [true, 'Resort rating is required.'],
    min: [1, 'Rating must be between 1 and 5.'],
    max: [5, 'Rating must be between 1 and 5.'],
  },
  perPerson: {
    type: String, 
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
module.exports = mongoose.models.Trip || mongoose.model('Trip', TripSchema);