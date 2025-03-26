const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure you have a "User" model
      required: true,
    },
    type: {
      type: String,
      enum: ["Guides locaux", "Artisans", "Hébergeurs", "Transporteurs", "Loueurs de matériel"],
      required: true,
    },
    description: { type: String, required: true },
    photo: { type: String }, // URL de l'image
    phoneNumber: { type: String, required: true }, // Numéro de contact du fournisseur
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
