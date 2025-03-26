const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken"); // ✅ Now it exists
const verifyRole = require("../middleware/verifyFournisseur"); // ✅ Now it exists

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Get all services (Accessible by admins, suppliers, and travelers)
router.get("/", verifyToken, verifyRole(["admin", "fournisseur", "voyageur"]), getAllServices);

// Get service details by ID (Accessible by all authenticated users)
router.get("/:id", verifyToken, getServiceById);

// Create a new service (Only for suppliers)
router.post("/", verifyToken, verifyRole(["fournisseur"]), createService);

// Update a service (Only for suppliers)
router.put("/:id", verifyToken, verifyRole(["fournisseur"]), updateService);

// Delete a service (Only for admins and suppliers)
router.delete("/:id", verifyToken, verifyRole(["admin", "fournisseur"]), deleteService);

module.exports = router;
