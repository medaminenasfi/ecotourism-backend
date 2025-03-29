const Avis = require('../models/Avis');

// Add a new review (Avis)
const addAvis = async (req, res) => {
  try {
    const { circuitId, rating, comment } = req.body;
    const newAvis = new Avis({ userId: req.user.id, circuitId, rating, comment });
    await newAvis.save();
    res.status(201).json({ message: "Avis ajouté avec succès", avis: newAvis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing review
const updateAvis = async (req, res) => {
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
};

// Delete an existing review
const deleteAvis = async (req, res) => {
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
};

// Get all reviews
const getAllAvis = async (req, res) => {
  try {
    const avis = await Avis.find();
    res.status(200).json({ avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reviews for a specific circuit
const getAvisByCircuit = async (req, res) => {
  try {
    const { circuitId } = req.params;
    const avis = await Avis.find({ circuitId });
    res.status(200).json({ avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addAvis, updateAvis, deleteAvis, getAllAvis, getAvisByCircuit };
