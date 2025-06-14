const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    type: {
      type: String,
      enum: ["Guides locaux", "Artisans", "Hébergeurs", "Transporteurs", "Loueurs de matériel"],
      required: true,
    },
    description: { type: String, required: true },
    photo: { type: String }, 
    phoneNumber: { type: String, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
