const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    console.log("🔍 Incoming Auth Header:", authHeader); 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No valid token found.");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("❌ JWT Verification Failed:", err.message);
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }

        req.user = decoded.UserInfo || {};
        console.log("✅ Decoded Token:", req.user);

        next();
    });
};

module.exports = verifyJWT;
