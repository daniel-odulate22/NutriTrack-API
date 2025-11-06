// in routes/apiRoutes.js
const express = require('express');
const Food = require('../models/foodModel');
const MealLog = require('../models/mealLogModel');
const User = require('../models/userModel');
const Tip = require('../models/tipModel');
const { protect } = require('../middleware/authMiddleware'); // Our "Bouncer"
const router = express.Router();

// "RECIPE" FOR LOGGING A MEAL (Protected)
// Path: /meals/log
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
// Path: /meals/me
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
// Path: /suggestions
router.get('/suggestions', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/suggestions recipe has started ---");
  try {
    const user = await User.findById(req.user.id); // Get fresh user data
    const userGoal = user.goal;
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
// Path: /meals/:id  (e.g., /api/meals/6727e4b9... )
router.delete('/meals/:id', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/meals/:id recipe has started ---");

  try {
    // 1. Get the Guest's ID (from the Bouncer)
    const userId = req.user.id;

    // 2. Get the Meal Log's ID (from the URL)
    const mealId = req.params.id; // req.params.id gets the :id from the URL

    // 3. Find that specific log in the "Logbook"
    const mealLog = await MealLog.findById(mealId);

    // 4. Check if the log even exists
    if (!mealLog) {
      console.log("--- DELETE FAILED: Log not found ---");
      return res.status(404).send('Meal log not found.');
    }

    // 5. CRITICAL: Check if this user OWNS this log
    // We must convert the user ID (which is an Object) to a string to compare
    if (mealLog.user.toString() !== userId) {
      console.log("--- DELETE FAILED: User does not own this log ---");
      return res.status(401).send('Not authorized to delete this log.');
    }

    // 6. If they own it, delete it!
    await MealLog.deleteOne({ _id: mealId }); // or await mealLog.deleteOne();
    
    console.log("--- CHECKPOINT 2: Meal log deleted successfully ---");

    // 7. Send a success message
    res.status(200).send('Meal log deleted');

  } catch (error) {
    console.error("--- !!! DELETE MEAL CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR UPDATING MY PROFILE (Protected)
// Path: /users/me
router.put('/users/me', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/users/me recipe has started ---");

  try {
    // 1. Get the Guest's ID (from the Bouncer)
    const userId = req.user.id;

    // 2. Find that user in the "User" drawer
    const user = await User.findById(userId);

    if (!user) {
      console.log("--- UPDATE FAILED: User not found ---");
      return res.status(404).send('User not found.');
    }

    // 3. Get the new details from the "order ticket" (the body)
    const { name, email, goal } = req.body;

    // 4. Update the user's details *only* if they were provided
    if (name) {
      user.name = name;
      console.log("--- User name updated ---");
    }
    if (email) {
      user.email = email;
      console.log("--- User email updated ---");
    }
    if (goal) {
      user.goal = goal;
      console.log("--- User goal updated ---");
    }
    // We are NOT updating the password here, that's a separate, more complex feature.

    // 5. Save the updated user back to the database
    const updatedUser = await user.save();
    console.log("--- CHECKPOINT 2: User profile updated! ---");

    // 6. Send back the updated user's info (but not their password!)
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
// Path: /tips/random
router.get('/tips/random', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/tips/random recipe has started ---");
  try {
    // This is a special MongoDB command to get 1 random document
    const randomTip = await Tip.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (!randomTip || randomTip.length === 0) {
      return res.status(404).send('No tips found in the database.');
    }

    // Send the first (and only) tip from the array
    res.status(200).json(randomTip[0]);

  } catch (error) {
    console.error("--- !!! GET TIP CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

module.exports = router;