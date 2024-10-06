const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token is invalid or expired." });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "No token provided." });
  }
};

module.exports = isAuthenticated;
