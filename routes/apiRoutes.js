// in routes/apiRoutes.js
const express = require('express');
const Food = require('../models/foodModel');
const MealLog = require('../models/mealLogModel');
const User = require('../models/userModel');
const Tip = require('../models/tipModel'); // Tip Model
const { protect } = require('../middleware/authMiddleware'); // Our "Bouncer"
const router = express.Router();

// "RECIPE" FOR LOGGING A MEAL (v2 - Now accepts custom foods)
// This is the only version of this route
router.post('/meals/log', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/meals/log (v2) recipe started ---");
  try {
    const { foodId, customName, calories, protein_g, carbs_g, fats_g, mealType, servingSize } = req.body;
    const userId = req.user.id;

    let newLog;

    if (foodId) {
      // --- LOGIC FOR A "QUICK ADD" (NORMAL) MEAL ---
      const food = await Food.findById(foodId);
      if (!food) return res.status(404).send('Food not found');

      newLog = new MealLog({
        user: userId,
        food: foodId,
        mealType: mealType || 'Snack', // Default to snack if not provided
        servingSize: servingSize || 1,
        // We get calories from the food model
        calories: food.calories * (servingSize || 1),
        protein_g: food.protein_g * (servingSize || 1),
        carbs_g: food.carbs_g * (servingSize || 1),
        fats_g: food.fats_g * (servingSize || 1),
      });

    } else if (customName) {
      // --- LOGIC FOR A "CUSTOM" MEAL ---
      if (!calories || !mealType) {
        return res.status(400).send('Custom name, calories, and mealType are required.');
      }

      newLog = new MealLog({
        user: userId,
        customName: customName,
        mealType: mealType,
        servingSize: 1, // Custom meals are always 1 serving
        calories: calories,
        protein_g: protein_g || 0,
        carbs_g: carbs_g || 0,
        fats_g: fats_g || 0,
      });

    } else {
      return res.status(400).send('A foodId or a customName is required.');
    }

    // Save the new log
    await newLog.save();
    res.status(201).json(newLog); // Send the new log back

  } catch (error) {
    console.error("--- !!! MEAL LOG CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR GETTING ALL MY LOGGED MEALS (v2 - Now "populated")
router.get('/meals/me', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/meals/me (v2) recipe has started ---");
  try {
    const userId = req.user.id;
    const myLogs = await MealLog.find({ user: userId })
      .sort({ date: -1 })
      .populate('food'); // <-- This "populates" the food details
    
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

// "RECIPE" FOR GETTING MY (CURRENT USER'S) PROFILE (Protected)
router.get('/users/me', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/users/me recipe has started ---");
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("--- !!! GET USER PROFILE CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

// "RECIPE" FOR GETTING ALL FOODS (Protected)
router.get('/foods', protect, async (req, res) => {
  console.log("--- CHECKPOINT 1: /api/foods recipe has started ---");
  try {
    const allFoods = await Food.find({}).sort({ name: 1 });
    res.status(200).json(allFoods);
  } catch (error) {
    console.error("--- !!! GET FOODS CRASH REPORT !!! ---");
    console.error(error);
    res.status(500).send('The kitchen had a problem, please try again.');
  }
});

module.exports = router;