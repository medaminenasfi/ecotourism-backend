const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");  // Import admin middleware

// ✅ Protect all routes with JWT authentication
router.use(verifyJWT);

// ✅ Get all users (Admin only)
router.get("/", verifyAdmin,usersController.getAllUsers);

// ✅ Update user (Admin only)
router.put("/:id", verifyAdmin,usersController.updateUser);

// ✅ Delete user (Admin only)
router.delete("/:id",verifyAdmin, usersController.deleteUser);



// Get user profile
router.get("/profile", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Fetch user details
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send user data
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
