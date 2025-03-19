const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ REGISTER (INSCRIPTION)
const register = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, gender, role, email, password } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !phone_number || !gender || !role || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure only ONE admin exists
    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" }).exec();
      if (existingAdmin) {
        return res.status(403).json({ message: "Only one admin is allowed." });
      }
    }

    // Check if the user already exists
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      first_name,
      last_name,
      phone_number,
      gender,
      role,
      email,
      password: hashedPassword,
    });

    // Log the created user (optional)
    console.log("User created:", user);

    // Generate an access token
    const accessToken = jwt.sign(
      { UserInfo: { id: user._id, role: user.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Send the response
    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        gender: user.gender,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user by email
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: 'User does not exist' });
    }

    // Compare the password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: 'Wrong password' });

    // Generate an access token
    const accessToken = jwt.sign(
      { UserInfo: { id: foundUser._id, role: foundUser.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Send the response with the token and user info
    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: foundUser._id,
        email: foundUser.email,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        phone_number: foundUser.phone_number,
        gender: foundUser.gender,
        role: foundUser.role,
      },
    });
    

  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ REFRESH TOKEN
const refresh = (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      // Find the user associated with the refresh token
      const foundUser = await User.findById(decoded.UserInfo.id).exec();
      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      // Generate a new access token
      const accessToken = jwt.sign(
        { UserInfo: { id: foundUser._id, role: foundUser.role } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Return the new access token
      res.json({ accessToken });
    });

  } catch (error) {
    console.error("Error in refresh:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ LOGOUT
const logout = (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(200).json({ message: "logout successful" });

    // Clear the cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None', // Needed for cross-site cookies
      secure: process.env.NODE_ENV === 'production', // Only true for HTTPS in production
    });

    // Send response
    res.status(200).json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email and check role
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser || foundUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Compare the password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    // Generate an access token
    const accessToken = jwt.sign(
      { UserInfo: { id: foundUser._id, role: foundUser.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Send the response with the token
    res.json({
      message: "Admin login successful",
      accessToken,
      role: foundUser.role,
    });

  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  loginAdmin,
};
