// in index.js (The "Restaurant Manager")

// --- 1. IMPORT CORE TOOLS ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config();      

// --- 2. IMPORT OUR "COOKBOOKS" (Routes) ---
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

// --- 3. CREATE YOUR APP ---
const app = express();
const port = 3000;

// --- 4. USE YOUR "TOOLS" (Middleware) ---
app.use(cors()); // "Open door" for web browsers
app.use(express.json()); // "JSON ticket reader"

// --- 5. CONNECT TO YOUR DATABASE ---
mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log('Successfully connected to the pantry (MongoDB)!'))
  .catch((err) => console.error('Could not connect to pantry:', err));

// --- 6. TELL THE APP WHICH "COOKBOOK" TO USE ---
// For any "order" (request) starting with "/api/auth"
// ...go use the "authRoutes" cookbook.
app.use('/api/auth', authRoutes); 

// For any "order" starting with "/api" (e.g., /api/meals/log)
// ...go use the "apiRoutes" cookbook.
app.use('/api', apiRoutes);

// "Recipe" for the main page (a simple health check)
app.get('/', (req, res) => {
  console.log("--- CHECKPOINT: / (main page) recipe was hit! ---");
  res.send('Welcome to the NutriTrack Kitchen! We are OPEN!');
});

// --- 7. TURN ON YOUR KITCHEN "LIGHTS" ---
// app.listen(port, () => {
//   console.log(`Kitchen is running on http://localhost:${port}`);
// });

module.exports = app;