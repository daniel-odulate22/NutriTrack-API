// in models/tipModel.js
const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['nutrition', 'motivation', 'workout'], // Tip categories
    default: 'nutrition'
  },
  content: { 
    type: String, 
    required: true 
  }
});

const Tip = mongoose.model('Tip', tipSchema);
module.exports = Tip;