// This is a separate script, not part of your server!

const mongoose = require('mongoose');
const fs = require('fs'); // "File System" - a tool built into Node.js to read files
const path = require('path'); // A tool to help work with file paths
require('dotenv').config(); // So we can use our .env variables

// Import your "Food" blueprint
const Food = require('./models/foodModel');

// Get your pantry "key" from the .env file
const dbConnectionString = process.env.DB_CONNECTION_STRING;

// Get the full path to your JSON data file
const foodDataPath = path.join(__dirname, 'seedData.json');

// Read the JSON file and turn it into a JavaScript array
const foods = JSON.parse(fs.readFileSync(foodDataPath, 'utf-8'));

// The main "delivery" function
const importData = async () => {
  try {
    // 1. Connect the "delivery truck" to the pantry
    await mongoose.connect(dbConnectionString);
    console.log('Delivery truck connected to the pantry (MongoDB)!');

    // 2. Empty the "Food" shelf first (to avoid duplicates)
    await Food.deleteMany();
    console.log('Emptied the "Food" shelf...');

    // 3. Load the new groceries onto the shelf
    await Food.insertMany(foods);
    console.log('Successfully loaded all new groceries (foods)!');

    // 4. Disconnect the truck
    await mongoose.connection.close();
    console.log('Delivery truck has left.');
    process.exit();

  } catch (error) {
    console.error('Error with the delivery:', error);
    process.exit(1); // Exit with an error
  }
};

// Start the delivery!
importData();