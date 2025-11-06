// in routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Note: ../ to go "up" a folder
const router = express.Router(); // Get the "cookbook"

// "RECIPE" FOR SIGNUP (REGISTER)
// Note: The path is now just "/register"
router.post('/register', async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/auth/register recipe has started ---");
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send('Guest is already on the list (email in use)');
    }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).send('Welcome! You are now on the guest list.');
  } catch (error) {
    console.error("--- !!! AUTH CRASH REPORT (REGISTER) !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR LOGIN
// Note: The path is now just "/login"
router.post('/login', async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/auth/login recipe has started ---");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send('Login failed. Wrong email or password.');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send('Login failed. Wrong email or password.');
    }
    const payload = { user: { id: user.id, name: user.name, email: user.email, goal: user.goal } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
    res.status(200).json({ token: token });
  } catch (error) {
    console.error("--- !!! AUTH CRASH REPORT (LOGIN) !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

module.exports = router; // Export the "cookbook"