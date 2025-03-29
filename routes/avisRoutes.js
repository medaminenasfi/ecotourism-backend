const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { addAvis, updateAvis, deleteAvis, getAllAvis, getAvisByCircuit } = require("../controllers/avisController");

// Add a review
router.post("/", verifyJWT, addAvis);

// Update a review
router.put("/:id", verifyJWT, updateAvis);

// Delete a review
router.delete("/:id", verifyJWT, deleteAvis);

// Get all reviews
router.get("/", verifyJWT, getAllAvis);

// Get reviews for a specific circuit
router.get("/circuit/:circuitId", verifyJWT, getAvisByCircuit);

module.exports = router;
