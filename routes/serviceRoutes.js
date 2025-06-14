const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyFournisseur");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers JPEG, PNG et JPG sont autorisés"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Get all services
router.get("/", verifyToken, verifyRole(["admin", "fournisseur", "voyageur"]), getAllServices);

// Get a service by ID
router.get("/:id", verifyToken, getServiceById);

// Create a new service
router.post("/", verifyToken, verifyRole(["fournisseur"]), upload.single("photo"), createService);

// Update a service
router.put("/:id", verifyToken, verifyRole(["fournisseur"]), upload.single("photo"), updateService);

// Delete a service
router.delete("/:id", verifyToken, verifyRole(["admin", "fournisseur"]), deleteService);

module.exports = router;