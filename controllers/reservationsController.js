const Reservation = require('../models/Reservation');
const Circuit = require('../models/Circuit');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all reservations (Admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user circuit');
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reservations', error: err.message });
  }
};

// Get a single reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('user circuit');
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reservation', error: err.message });
  }
};

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { user, circuit, date, numberOfPeople, totalPrice } = req.body;

    // Check if all required fields are provided
    if (!user || !circuit || !date || !numberOfPeople || !totalPrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate ObjectId format for user and circuit
    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(circuit)) {
      return res.status(400).json({ message: 'Invalid user or circuit ID format' });
    }

    // Check if user and circuit exist
    const foundUser = await User.findById(user);
    const foundCircuit = await Circuit.findById(circuit);
    
    if (!foundUser) return res.status(404).json({ message: 'User not found' });
    if (!foundCircuit) return res.status(404).json({ message: 'Circuit not found' });

    // Create a new reservation
    const newReservation = new Reservation({
      user,
      circuit,
      date,
      numberOfPeople,
      totalPrice,
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating reservation', error: err.message });
  }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(updatedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating reservation', error: err.message });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting reservation', error: err.message });
  }
};
// ✅ Get reservations of the logged-in user
exports.getUserReservations = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = req.user.id;
    const reservations = await Reservation.find({ user: userId })
      .populate('circuit')
      .sort({ date: -1 }); // Sort by date descending

    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Error fetching your reservations', 
      error: err.message 
    });
  }
};