const Reclamation = require('../models/Reclamation');

// Add a new reclamation
const addReclamation = async (req, res) => {
  try {
    const { type, message } = req.body;
    const newReclamation = new Reclamation({ userId: req.user.id, type, message });
    await newReclamation.save();
    res.status(201).json({ message: "Réclamation ajoutée avec succès", reclamation: newReclamation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a reclamation
const updateReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation || reclamation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    reclamation.status = req.body.status;
    await reclamation.save();
    res.json({ message: "Réclamation mise à jour", reclamation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a reclamation
const deleteReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation || reclamation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    await reclamation.deleteOne();
    res.json({ message: "Réclamation supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReclamations = async (req, res) => {
  try {
    // Token should already be verified by `verifyJWT`
    const reclamations = await Reclamation.find();
    res.status(200).json({ reclamations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error occurred while fetching reclamations.' });
  }
};


// Get reclamations for a specific user
const getReclamationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reclamations = await Reclamation.find({ userId });
    res.status(200).json({ reclamations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReclamation, updateReclamation, deleteReclamation, getAllReclamations, getReclamationsByUser };
