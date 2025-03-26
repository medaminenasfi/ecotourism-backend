const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Correct payload structure access
    req.user = {
      id: decoded.UserInfo.id,
      role: decoded.UserInfo.role.toLowerCase() || ""  // Normalize to lowercase
    };

    console.log(`Authenticated user: ${req.user.id} (${req.user.role})`);
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(403).json({ 
      message: "Invalid token",
      error: error.name
    });
  }
};

module.exports = verifyToken;