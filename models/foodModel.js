// in models/foodModel.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true // Prevents duplicate food names
  },
  serving_unit: { 
    type: String, 
    required: true, 
    default: '100g' // Standardize on 100g
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
  }
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;