const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // lowercase always
  if (!authHeader) return res.status(401).json({ message: "Access Denied: No token" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;