const Circuit = require('../models/Circuit');

// Get all circuits
exports.getAllCircuits = async (req, res) => {
  try {
    const circuits = await Circuit.find();
    res.status(200).json(circuits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching circuits', error: err.message });
  }
};

// Get a single circuit by ID
exports.getCircuitById = async (req, res) => {
  try {
    const circuit = await Circuit.findById(req.params.id);
    if (!circuit) {
      return res.status(404).json({ message: 'Circuit not found' });
    }
    res.status(200).json(circuit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching circuit', error: err.message });
  }
};

// Create a new circuit
// controllers/circuitsController.js
exports.createCircuit = async (req, res) => {
  try {
    const { name, description, duration, price, difficulty } = req.body;
    
    const newCircuit = await Circuit.create({
      name,
      description,
      duration,
      price,
      difficulty
    });
    
    res.status(201).json(newCircuit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating circuit', error: error.message });
  }
};

// Remove all coordinate/region-related logic

// Update a circuit
exports.updateCircuit = async (req, res) => {
  try {
    const updatedCircuit = await Circuit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCircuit) {
      return res.status(404).json({ message: 'Circuit not found' });
    }
    res.status(200).json(updatedCircuit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating circuit', error: err.message });
  }
};

// Delete a circuit
exports.deleteCircuit = async (req, res) => {
  try {
    const deletedCircuit = await Circuit.findByIdAndDelete(req.params.id);
    if (!deletedCircuit) {
      return res.status(404).json({ message: 'Circuit not found' });
    }
    res.status(200).json({ message: 'Circuit deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting circuit', error: err.message });
  }
};
