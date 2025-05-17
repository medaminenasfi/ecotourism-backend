const Reservation = require('../models/Reservation');
const Circuit = require('../models/Circuit');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all reservations (Admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const sort = req.query.sort || '-createdAt'; // Tri par défaut
    const reservations = await Reservation.find()
      .populate('user circuit')
      .sort(sort);
      
    res.status(200).json(reservations);
  } catch (err) {
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
    const { user,  name,circuit, circuitDetails, date, numberOfPeople, totalPrice, isTempCircuit } = req.body;

    // Validate required fields
    if (!user || !date || !numberOfPeople || !totalPrice  || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate circuit reference for database circuits
    if (!isTempCircuit && !mongoose.Types.ObjectId.isValid(circuit)) {
      return res.status(400).json({ message: "Invalid circuit ID format" });
    }

    // Validate temp circuit details
    if (isTempCircuit && (!circuitDetails?.name || !circuitDetails?.price)) {
      return res.status(400).json({ message: "Invalid circuit details" });
    }

    // Check user existence
    const userExists = await User.exists({ _id: user });
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const reservationData = {
      user,
      date,
      numberOfPeople,
      totalPrice,
      isTempCircuit,
      ...(isTempCircuit 
        ? { circuitDetails } 
        : { circuit })
    };

    const newReservation = await Reservation.create(reservationData);
    res.status(201).json(newReservation);

  } catch (error) {
    res.status(500).json({ message: 'Reservation failed', error: error.message });
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

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user is admin OR the owner of the reservation
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Cannot delete this reservation' });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting reservation', error: err.message });
  }
};
// ✅ Get reservations of the logged-in user
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .lean()
      .sort({ createdAt: -1 });

    // Add explicit circuitDetails field
    const enhancedReservations = reservations.map(res => ({
      ...res,
      circuitDetails: res.circuitDetails || null,
      isCustomCircuit: !!res.circuitDetails
    }));

    res.status(200).json(enhancedReservations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reservations', error: err.message });
  }
};