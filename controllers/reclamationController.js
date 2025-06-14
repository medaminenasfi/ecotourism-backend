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
    if (!reclamation) return res.status(404).json({ message: "Reclamation not found" });

    // Allow admin or owner to update
    if (req.user.role !== 'admin' && reclamation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Admins can only update status
    if (req.user.role === 'admin') {
      reclamation.status = req.body.status;
    } else {
      reclamation.type = req.body.type;
      reclamation.message = req.body.message;
      reclamation.status = req.body.status;
    }

    await reclamation.save();
    res.json({ message: "Reclamation updated", reclamation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a reclamation
const deleteReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) return res.status(404).json({ message: "Reclamation not found" });

    if (req.user.role !== 'admin' && reclamation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await reclamation.deleteOne();
    res.json({ message: "Reclamation deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find()
      .populate('userId', 'first_name last_name email'); 
    res.status(200).json({ reclamations });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Get reclamations by user (with user details)
const getReclamationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reclamations = await Reclamation.find({ userId })
      .populate('userId', 'name');
    res.status(200).json({ reclamations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { addReclamation, updateReclamation, deleteReclamation, getAllReclamations, getReclamationsByUser };
