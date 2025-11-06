const mongoose = require('mongoose');

// This is the "blueprint" for a user
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // No two users can have the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  goal: { 
    type: String, 
    default: 'maintain_weight', // A default goal
    enum: ['weight_loss', 'weight_gain', 'maintain_weight'] // Only allows these values
  }
});

// This creates a "drawer" (called 'User') in our pantry (database)
// using the blueprint we just made.
const User = mongoose.model('User', userSchema);

// This lets other files (like our index.js) use this blueprint
module.exports = User;