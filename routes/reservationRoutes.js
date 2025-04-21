const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");


router.use(verifyJWT);

// tout reser
router.get("/", verifyAdmin, reservationsController.getAllReservations);
// tout reser
router.get("/my-reservations", reservationsController.getUserReservations);

// seul reserv
router.get("/:id", reservationsController.getReservationById);

// crée reser
router.post("/", reservationsController.createReservation);

// mododifier  reser
router.put("/:id", verifyAdmin, reservationsController.updateReservation);

// suppr reser
router.delete("/:id", reservationsController.deleteReservation);

module.exports = router;
