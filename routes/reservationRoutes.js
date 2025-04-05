const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");

// ✅ Protect all routes with JWT authentication
router.use(verifyJWT);

// ✅ Get all reservations (Admin only)
router.get("/", verifyAdmin, reservationsController.getAllReservations);
// ✅ Get all reservations for the logged-in user
router.get("/my-reservations", reservationsController.getUserReservations);

// ✅ Get a single reservation by ID
router.get("/:id", reservationsController.getReservationById);

// ✅ Create a new reservation
router.post("/", reservationsController.createReservation);

// ✅ Update a reservation (Admin only)
router.put("/:id", verifyAdmin, reservationsController.updateReservation);

// ✅ Delete a reservation (Admin only)
router.delete("/:id", verifyAdmin, reservationsController.deleteReservation);

module.exports = router;
