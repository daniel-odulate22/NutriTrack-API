// in seedTips.js
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Tip = require('./models/tipModel'); // Import the new Tip model

const dbConnectionString = process.env.DB_CONNECTION_STRING;

// Our list of starter tips
const tips = [
  {
    category: 'nutrition',
    content: 'Did you know? A handful of groundnuts is a great source of protein!'
  },
  {
    category: 'motivation',
    content: 'Consistency is key! Even a 20-minute workout is better than no workout.'
  },
  {
    category: 'nutrition',
    content: 'Hydration check! Are you drinking enough water? Aim for 8 glasses a day.'
  },
  {
    category: 'workout',
    content: 'Don\'t skip leg day! Strong legs are the foundation for a strong body.'
  }
];

const importTips = async () => {
  try {
    await mongoose.connect(dbConnectionString);
    console.log('Connected to MongoDB!');
    await Tip.deleteMany(); // Clear old tips
    console.log('Emptied the "Tip" shelf...');
    await Tip.insertMany(tips); // Add new tips
    console.log('Successfully loaded all new tips!');
    await mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error('Error with the delivery:', error);
    process.exit(1);
  }
};

importTips();