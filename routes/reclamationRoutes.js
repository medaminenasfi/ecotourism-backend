const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { addReclamation, updateReclamation, deleteReclamation, getAllReclamations, getReclamationsByUser } = require("../controllers/reclamationController");

// ajouter reclamation
router.post("/", verifyJWT, addReclamation);

// moddifreclamation
router.put("/:id", verifyJWT, updateReclamation);

// supp reclamation
router.delete("/:id", verifyJWT, deleteReclamation);

// tous reclamations
router.get("/", verifyJWT, getAllReclamations);

// reclamatin utik
router.get("/user/:userId", verifyJWT, getReclamationsByUser);

module.exports = router;
