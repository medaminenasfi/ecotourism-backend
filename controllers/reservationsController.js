const Reservation = require('../models/Reservation');
const Circuit = require('../models/Circuit');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all reservations (Admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const sort = req.query.sort || '-createdAt'; 
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

    if (!user || !date || !numberOfPeople || !totalPrice  || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isTempCircuit && !mongoose.Types.ObjectId.isValid(circuit)) {
      return res.status(400).json({ message: "Invalid circuit ID format" });
    }

    if (isTempCircuit && (!circuitDetails?.name || !circuitDetails?.price)) {
      return res.status(400).json({ message: "Invalid circuit details" });
    }

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
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
 const isAdmin = req.user.role === 'admin';
    const isOwner = reservation.user.toString() === req.user.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Unauthorized: Cannot update this reservation' });
    }

    // Extract updatable fields
    const { date, numberOfPeople, status, totalPrice } = req.body; // Add status and totalPrice
    if (status && !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (totalPrice && totalPrice < 0) {
      return res.status(400).json({ message: "Total price must be positive" });
    }
    if (date && new Date(date) < new Date()) {
      return res.status(400).json({ message: "Reservation date must be in the future" });
    }
    
    if (numberOfPeople && (numberOfPeople < 1 || numberOfPeople > 20)) {
      return res.status(400).json({ message: "Number of people must be between 1 and 20" });
    }

    // Create update object
    const updateData = {};
    if (date) updateData.date = date;
    if (numberOfPeople) updateData.numberOfPeople = numberOfPeople;
if (status) updateData.status = status;             
    if (totalPrice) updateData.totalPrice = totalPrice; 
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user circuit');

    res.status(200).json(updatedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Error updating reservation', 
      error: err.message 
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

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
//  Get reservations of the logged-in user
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .lean()
      .sort({ createdAt: -1 });

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
exports.getPopularCircuitsStats = async (req, res) => {
  try {
    const popularCircuits = await Reservation.aggregate([
      {
        $facet: {
          standard: [
            { $match: { circuit: { $ne: null } } },
            { $group: { 
              _id: '$circuit', 
              reservationCount: { $sum: 1 },
              totalRevenue: { $sum: "$totalPrice" }
            }},
            { $sort: { reservationCount: -1 } },
            { $limit: 5 }
          ],
          custom: [
            { $match: { circuit: null, "circuitDetails.name": { $exists: true } } },
            { $group: { 
              _id: '$circuitDetails.name', 
              reservationCount: { $sum: 1 },
              totalRevenue: { $sum: "$totalPrice" },
              isCustom: { $first: true }
            }},
            { $sort: { reservationCount: -1 } },
            { $limit: 5 }
          ]
        }
      },
      {
        $project: {
          combined: { $concatArrays: ["$standard", "$custom"] }
        }
      },
      { $unwind: "$combined" },
      { $replaceRoot: { newRoot: "$combined" } },
      { $sort: { reservationCount: -1 } },
      { $limit: 10 }
    ]);

    const standardIds = popularCircuits
      .filter(item => !item.isCustom)
      .map(item => item._id);
    
    const circuits = await Circuit.find({ _id: { $in: standardIds } });

    const result = popularCircuits.map(item => {
      if (item.isCustom) {
        return {
          circuitId: null,
          circuitName: item._id,
          reservationCount: item.reservationCount,
          totalRevenue: item.totalRevenue,
          isCustom: true
        };
      } else {
        const circuit = circuits.find(c => c._id.equals(item._id));
        return {
          circuitId: item._id,
          circuitName: circuit ? circuit.name : 'Circuit inconnu',
          reservationCount: item.reservationCount,
          totalRevenue: item.totalRevenue,
          isCustom: false
        };
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  méthode: Revenus par mois
exports.getRevenueByMonthStats = async (req, res) => {
  try {
    const revenueByMonth = await Reservation.aggregate([
      { 
        $group: {
          _id: { 
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalRevenue: { $sum: "$totalPrice" },
          reservationCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: { 
            $dateToString: { 
              format: "%Y-%m", 
              date: { 
                $dateFromParts: { 
                  year: "$_id.year", 
                  month: "$_id.month" 
                } 
              } 
            } 
          },
          totalRevenue: 1,
          reservationCount: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json(revenueByMonth);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};