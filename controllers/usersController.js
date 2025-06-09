const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const users = await User.find().select("-password").lean();
    if (!users.length) {
      return res.status(400).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user details (Admin only)
const updateUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  const { id } = req.params;
  const updates = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Delete user (Admin only)
const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Update own profile (for logged-in user)
const updateUserProfile = async (req, res) => {
  const { id } = req.user; // From JWT token
  const updates = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  // Prevent role changes
  if (updates.role) {
    return res.status(403).json({ message: "Cannot change user role" });
  }

  // Hash password if provided
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
    updateUserProfile // Add this line

};
