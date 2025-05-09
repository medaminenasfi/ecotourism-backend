const mongoose = require("mongoose");

const CircuitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true }, 
    price: { type: Number, required: true },
    difficulty: { type: String, enum: ["Facile", "Moyen", "Difficile"], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Circuit", CircuitSchema);
