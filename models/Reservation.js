const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  circuit: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Circuit' 
  }, // For database circuits
  circuitDetails: { // For map-created circuits
    name: String,
    price: Number,
    duration: Number,
    difficulty: String,
    location: String
  },
  date: { 
    type: Date, 
    required: true 
  },
  numberOfPeople: { 
    type: Number, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  isTempCircuit: {
    type: Boolean,
    default: false
  },
  // In Reservation model
status: {
  type: String,
  enum: ['pending', 'confirmed', 'cancelled'],
  default: 'pending'
}
}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);