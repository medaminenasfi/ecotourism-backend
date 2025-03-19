const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    circuit: { type: mongoose.Schema.Types.ObjectId, ref: "Circuit", required: true },
    date: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reservation", ReservationSchema);
