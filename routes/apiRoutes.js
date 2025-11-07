// in routes/apiRoutes.js
const express = require('express');
const Food = require('../models/foodModel');
const MealLog = require('../models/mealLogModel');
const User = require('../models/userModel');
const Tip = require('../models/tipModel'); // Tip Model
const { protect } = require('../middleware/authMiddleware'); // Our "Bouncer"
const router = express.Router();

// "RECIPE" FOR LOGGING A MEAL (Protected)
router.post('/meals/log', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/meals/log recipe has started ---");
  try {
    const { foodId, servingSize } = req.body;
    const userId = req.user.id; 
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).send('Food not found in pantry');
    }
    const newLog = new MealLog({ user: userId, food: foodId, servingSize: servingSize });
    await newLog.save();
    res.status(201).send('Meal successfully logged');
  } catch (error) {
    console.error("--- !!! MEAL LOG CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR GETTING ALL MY LOGGED MEALS (Protected)
router.get('/meals/me', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/meals/me recipe has started ---");
  try {
    const userId = req.user.id;
    const myLogs = await MealLog.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(myLogs);
  } catch (error) {
    console.error("--- !!! GET MY MEALS CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR GETTING SMART SUGGESTIONS (Protected)
router.get('/suggestions', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/suggestions recipe has started ---");
  try {
    const userGoal = req.user.goal; 
    console.log(`--- CHECKPOINT 2: Finding suggestions for goal: ${userGoal} ---`);
    let query = {};
    if (userGoal === 'weight_loss') {
      query = { calories: { $lt: 150 } }; 
    } else if (userGoal === 'weight_gain') {
      query = { $or: [ { protein_g: { $gt: 20 } }, { calories: { $gt: 400 } } ] };
    } else {
      query = { calories: { $gte: 100, $lte: 300 } };
    }
    const suggestions = await Food.find(query).limit(10);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("--- !!! SUGGESTIONS CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR DELETING A MEAL LOG (Protected)
router.delete('/meals/:id', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/meals/:id recipe has started ---");
  try {
    const userId = req.user.id;
    const mealId = req.params.id; 
    const mealLog = await MealLog.findById(mealId);
    if (!mealLog) {
      return res.status(404).send('Meal log not found.');
    }
    if (mealLog.user.toString() !== userId) {
      return res.status(401).send('Not authorized to delete this log.');
    }
    await MealLog.deleteOne({ _id: mealId }); 
    res.status(200).send('Meal log deleted');
  } catch (error) {
    console.error("--- !!! DELETE MEAL CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR UPDATING MY PROFILE (Protected)
router.put('/users/me', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/users/me recipe has started ---");
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    const { name, email, goal } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (goal) user.goal = goal;
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      goal: updatedUser.goal,
    });
  } catch (error) {
    console.error("--- !!! UPDATE PROFILE CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR GETTING A RANDOM TIP (Protected)
router.get('/tips/random', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/tips/random recipe has started ---");
  try {
    const randomTip = await Tip.aggregate([ { $sample: { size: 1 } } ]);
    if (!randomTip || randomTip.length === 0) {
      return res.status(404).send('No tips found in the database.');
    }
    res.status(200).json(randomTip[0]);
  } catch (error) {
    console.error("--- !!! GET TIP CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

module.exports = router;