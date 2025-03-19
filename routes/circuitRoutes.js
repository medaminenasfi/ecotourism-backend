const express = require("express");
const router = express.Router();
const circuitsController = require("../controllers/circuitsController");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyJWT = require("../middleware/verifyJWT");

// ✅ Protect all routes with JWT authentication
router.use(verifyJWT);

// ✅ Get all circuits
router.get("/", circuitsController.getAllCircuits);

// ✅ Get a single circuit by ID
router.get("/:id", circuitsController.getCircuitById);

// ✅ Create a new circuit (Admin only)
router.post("/", verifyAdmin, circuitsController.createCircuit);

// ✅ Update a circuit (Admin only)
router.put("/:id", verifyAdmin, circuitsController.updateCircuit);

// ✅ Delete a circuit (Admin only)
router.delete("/:id", verifyAdmin, circuitsController.deleteCircuit);

module.exports = router;
