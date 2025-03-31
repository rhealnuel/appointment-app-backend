const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from header
  
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No Token Provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Attach user info to request object
    next(); // Continue to the next middleware or route
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token." });
  }
};

// ✅ Export the middleware
module.exports = verifyToken;
