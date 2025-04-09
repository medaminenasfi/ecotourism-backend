const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { addAvis, updateAvis, deleteAvis, getAllAvis, getAvisByCircuit } = require("../controllers/avisController");

// creer review
router.post("/", verifyJWT, addAvis);

// modiif review
router.put("/:id", verifyJWT, updateAvis);

//suppreview
router.delete("/:id", verifyJWT, deleteAvis);

// tousreviews
router.get("/", verifyJWT, getAllAvis);

// reviews  circuit
router.get("/circuit/:circuitId", verifyJWT, getAvisByCircuit);

module.exports = router;
