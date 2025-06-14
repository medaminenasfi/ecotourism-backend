const Review = require('../models/Review');
const Circuit = require('../models/Circuit');

// Create a Review
exports.createReview = async (req, res) => {
    try {
        const { circuitId, rating, comment } = req.body;
        const userId = req.user.id;

        const circuit = await Circuit.findById(circuitId);
        if (!circuit) return res.status(404).json({ message: 'Circuit not found' });

        const review = new Review({ user: userId, circuitId, rating, comment });
        await review.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Reviews for a Circuit
exports.getReviewsByCircuit = async (req, res) => {
    try {
        const reviews = await Review.find({ circuitId: req.params.circuitId }).populate('user', 'first_name last_name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Review
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await review.deleteOne();
        res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
