const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  reminderType: {
    type: String,
    required: true,
    enum: ['Meal', 'Hydration', 'Workout']
  },
  time: {
    type: String, // Storing as "HH:MM" string, e.g., "08:30"
    required: true
  }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;