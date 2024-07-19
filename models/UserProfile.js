const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user profile schema
const UserProfileSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    // required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    // required: true
  },
  weightKg: {
    type: Number,
    // required: true
  },
  heightCm: {
    type: Number,
    // required: true
  },
  goalWeightKg: {
    type: Number,
    // required: true
  },
  dailyCalorieIntake: {
    type: Number,
    // required: true
  },
  mealsPerDay: {
    type: Number,
    // required: true,
    default: 3
  },
  activityLevel: {
    type: String,
    enum: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'],
    // required: true
  },
  dietaryPreferences: {
    type: [String],
    enum: ['Anything', 'Paleo', 'Vegetarian', 'Vegan', 'Ketogenic'],
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a pre-save hook to update the updatedAt field
UserProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;
