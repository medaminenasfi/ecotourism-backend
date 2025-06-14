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
  const { id } = req.user;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.first_name = updates.first_name || user.first_name;
    user.last_name = updates.last_name || user.last_name;
    user.phone_number = updates.phone_number || user.phone_number;
    user.gender = updates.gender || user.gender;

    let shouldLogout = false;
    
    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, 10);
      shouldLogout = true;
    }

    const updatedUser = await user.save();
    
    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;

    res.json({ 
      message: "Profile updated successfully", 
      user: userWithoutPassword,
      shouldLogout
    });
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
    updateUserProfile 
};
