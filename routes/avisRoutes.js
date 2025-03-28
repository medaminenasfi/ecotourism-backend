const express = require("express");
const Avis = require("../models/Avis");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT"); // Protéger les routes

// Ajouter un avis
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { circuitId, rating, comment } = req.body;
    const newAvis = new Avis({ userId: req.user.id, circuitId, rating, comment });
    await newAvis.save();
    res.status(201).json({ message: "Avis ajouté avec succès", avis: newAvis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modifier un avis
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis || avis.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    avis.rating = req.body.rating;
    avis.comment = req.body.comment;
    await avis.save();
    res.json({ message: "Avis mis à jour", avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un avis
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis || avis.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    await avis.deleteOne();
    res.json({ message: "Avis supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer tous les avis
router.get("/", verifyJWT, async (req, res) => {
  try {
    const avis = await Avis.find();
    res.status(200).json({ avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les avis pour un circuit spécifique
router.get("/circuit/:circuitId", verifyJWT, async (req, res) => {
  try {
    const { circuitId } = req.params;
    const avis = await Avis.find({ circuitId });
    res.status(200).json({ avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
