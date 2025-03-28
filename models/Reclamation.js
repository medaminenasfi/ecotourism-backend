const mongoose = require("mongoose");

const reclamationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["fournisseur", "artisan", "circuit", "sécurité", "problème de financement", "autre"], 
    required: true 
  },
    message: { type: String, required: true },
  status: { type: String, enum: ["en cours", "traité"], default: "en cours" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reclamation", reclamationSchema);
