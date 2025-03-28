const express = require("express"); 
const Reclamation = require("../models/Reclamation"); 
const router = express.Router(); 
const verifyJWT = require("../middleware/verifyJWT");

const validTypes = ["fournisseur", "artisan", "circuit", "sécurité", "problème de financement", "autre"];

// Soumettre une réclamation
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { type, message } = req.body;

    // Vérification de la validité du type
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Type de réclamation invalide." });
    }

    const newReclamation = new Reclamation({ userId: req.user.id, type, message });
    await newReclamation.save();
    
    res.status(201).json({ message: "Réclamation soumise avec succès", reclamation: newReclamation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer toutes les réclamations (accessible à tous les "admin", "fournisseur", "voyageur")
router.get("/", verifyJWT, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a le droit de voir toutes les réclamations
    const allowedRoles = ['admin', 'fournisseur', 'voyageur'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de voir toutes les réclamations." });
    }

    const reclamations = await Reclamation.find();
    res.status(200).json({ reclamations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modifier une réclamation
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params; // ID de la réclamation
    const { type, message } = req.body;

    // Vérification de la validité du type
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ message: "Type de réclamation invalide." });
    }

    const reclamation = await Reclamation.findById(id);

    // Vérifier si la réclamation existe
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée." });
    }

    // Vérifier si l'utilisateur a le droit de modifier cette réclamation
    if (reclamation.userId.toString() !== req.user.id && !['admin', 'fournisseur', 'voyageur'].includes(req.user.role)) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de modifier cette réclamation." });
    }

    // Mise à jour de la réclamation
    reclamation.type = type || reclamation.type;
    reclamation.message = message || reclamation.message;
    await reclamation.save();

    res.status(200).json({ message: "Réclamation mise à jour avec succès", reclamation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une réclamation
// Supprimer une réclamation
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params; // ID de la réclamation

    const reclamation = await Reclamation.findById(id);

    // Vérifier si la réclamation existe
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée." });
    }

    // Vérifier si l'utilisateur a le droit de supprimer cette réclamation
    if (reclamation.userId.toString() !== req.user.id && !['admin', 'fournisseur', 'voyageur'].includes(req.user.role)) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer cette réclamation." });
    }

    // Utiliser deleteOne pour supprimer la réclamation
    await Reclamation.deleteOne({ _id: id });

    res.status(200).json({ message: "Réclamation supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
