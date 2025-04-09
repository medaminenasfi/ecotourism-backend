const express = require("express");
const router = express.Router();
const circuitsController = require("../controllers/circuitsController");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

// tous circuits
router.get("/", circuitsController.getAllCircuits);

// seul circuit by ID
router.get("/:id", circuitsController.getCircuitById);

// Cree circuit (Admin only)
router.post("/", verifyAdmin, circuitsController.createCircuit);

// modifcircuit (Admin only)
router.put("/:id", verifyAdmin, circuitsController.updateCircuit);

// Supri circuit (Admin only)
router.delete("/:id", verifyAdmin, circuitsController.deleteCircuit);

module.exports = router;
