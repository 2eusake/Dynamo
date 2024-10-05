const jwt = require("jsonwebtoken");
const { User } = require("../models");

const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = isAuthenticated;
