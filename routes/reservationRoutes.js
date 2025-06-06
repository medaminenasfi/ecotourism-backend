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
// Remplacer la ligne existante par :
router.put("/:id", reservationsController.updateReservation);
router.put("/:id", verifyAdmin, reservationsController.updateReservation);

// suppr reser
router.delete("/:id", reservationsController.deleteReservation);

// Nouvelles routes de statistiques
router.get(
  '/stats/popular-circuits', 
  verifyAdmin, 
  reservationsController.getPopularCircuitsStats
);

router.get(
  '/stats/revenue-by-month', 
  verifyAdmin, 
  reservationsController.getRevenueByMonthStats
);
module.exports = router;
