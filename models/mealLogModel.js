// in models/mealLogModel.js
const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  // A "link" to the specific user who logged this
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // This tells Mongoose to "look in the User drawer"
  },
  // A "link" to the specific food they ate
  food: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Food' // This tells Mongoose to "look in the Food drawer"
  },
  // When they ate it
  date: {
    type: Date,
    default: Date.now // Automatically sets to right now
  },
  // How many servings (e.g., 1.5 servings of 100g)
  servingSize: {
    type: Number,
    required: true,
    default: 1
  }
});

const MealLog = mongoose.model('MealLog', mealLogSchema);
module.exports = MealLog;