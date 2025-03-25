const express = require('express');
const { createReview, getReviewsByCircuit, updateReview, deleteReview } = require('../controllers/reviewsController');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

router.post('/', verifyJWT, createReview);
router.get('/:circuitId', getReviewsByCircuit);
router.put('/:id', verifyJWT, updateReview);
router.delete('/:id', verifyJWT, deleteReview);

module.exports = router;
