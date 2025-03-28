const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  circuitId: { type: mongoose.Schema.Types.ObjectId, ref: "Circuit", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Avis", avisSchema);
