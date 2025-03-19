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
exports.createCircuit = async (req, res) => {
  try {
    const { name, description, location, duration, price, difficulty } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !location || !duration || !price || !difficulty) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new circuit
    const newCircuit = new Circuit({
      name,
      description,
      location,
      duration,
      price,
      difficulty,
    });

    await newCircuit.save();
    res.status(201).json(newCircuit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating circuit', error: err.message });
  }
};

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
