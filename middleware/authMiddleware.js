// in middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  console.log("--- BOUNCER: Checking for VIP Pass... ---");
  let token;

  // 1. Check if the "VIP Pass" (token) exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    try {
      // 2. Get the token from the header (it looks like "Bearer [the-token]")
      token = req.headers.authorization.split(' ')[1];
      console.log("--- BOUNCER: Pass found. Verifying... ---");

      // 3. Verify the token is real
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("--- BOUNCER: Pass is valid! Letting guest in. ---");

      // 4. Attach the user's info to the "order" (the req object)
      req.user = decoded.user;

      // 5. Let the user pass the bouncer and go to the "recipe"
      next();

    } catch (error) {
      // If the token is fake or expired...
      console.error("--- BOUNCER: Pass is FAKE or EXPIRED! ---", error.message);
      res.status(401).send('Not authorized, token failed');
    }

  } else {
    // If they didn't even show a token...
    console.log("--- BOUNCER: No pass shown! Turning guest away. ---");
    res.status(401).send('Not authorized, no token');
  }
};

module.exports = { protect };