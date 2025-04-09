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

// tous les services
router.get("/", verifyToken, verifyRole(["admin", "fournisseur", "voyageur"]), getAllServices);

// sevice id
router.get("/:id", verifyToken, getServiceById);

// creée servi
router.post("/", verifyToken, verifyRole(["fournisseur"]), createService);

// modifier serv
router.put("/:id", verifyToken, verifyRole(["fournisseur"]), updateService);

// supprimer servi
router.delete("/:id", verifyToken, verifyRole(["admin", "fournisseur"]), deleteService);

module.exports = router;
