const mongoose = require("mongoose");

const CircuitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in hours
    price: { type: Number, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Circuit", CircuitSchema);
