const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { addReclamation, updateReclamation, deleteReclamation, getAllReclamations, getReclamationsByUser } = require("../controllers/reclamationController");

// Add a reclamation
router.post("/", verifyJWT, addReclamation);

// Update a reclamation
router.put("/:id", verifyJWT, updateReclamation);

// Delete a reclamation
router.delete("/:id", verifyJWT, deleteReclamation);

// Get all reclamations
router.get("/", verifyJWT, getAllReclamations);

// Get reclamations for a specific user
router.get("/user/:userId", verifyJWT, getReclamationsByUser);

module.exports = router;
