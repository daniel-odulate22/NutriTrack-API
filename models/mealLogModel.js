// in models/mealLogModel.js
const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  // A "link" to the specific user who logged this
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // --- This is for NORMAL foods from our database ---
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: false // Now optional!
  },
  // --- These are for NEW CUSTOM foods ---
  customName: {
    type: String,
    required: false
  },
  calories: {
    type: Number,
    required: true
  },
  protein_g: {
    type: Number,
    default: 0
  },
  carbs_g: {
    type: Number,
    default: 0
  },
  fats_g: {
    type: Number,
    default: 0
  },
  // --- Other info ---
  mealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  },
  servingSize: {
    type: Number,
    required: true,
    default: 1
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const MealLog = mongoose.model('MealLog', mealLogSchema);
module.exports = MealLog;