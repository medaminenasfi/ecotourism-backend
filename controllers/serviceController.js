const Service = require("../models/Service");

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("fournisseur", "first_name last_name phone_number");
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Get a service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("fournisseur", "first_name last_name phone_number");

    if (!service) return res.status(404).json({ message: "Service non trouvé" });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Create a new service
const createService = async (req, res) => {
  try {
    const { type, description, photo, phoneNumber } = req.body;

    const newService = new Service({
      fournisseur: req.user.id,
      type,
      description,
      photo,
      phoneNumber,
    });

    await newService.save();
    res.status(201).json({ message: "Service ajouté avec succès", service: newService });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Update a service by ID
const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedService) return res.status(404).json({ message: "Service non trouvé" });

    res.status(200).json({ message: "Service mis à jour", service: updatedService });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Delete a service by ID
const deleteService = async (req, res) => {
  try {
    if (!req.user) {
      console.log("❌ req.user is undefined"); // DEBUG
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    console.log("🛠️ Deleting service by user:", req.user);

    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Service non trouvé" });
    }

    console.log("✅ Service found:", service);

    // Vérifie si l'utilisateur est admin ou propriétaire
    if (req.user.role !== "admin" && service.fournisseur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service supprimé avec succès" });

  } catch (error) {
    console.error("❌ Delete Service Error:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

;

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
