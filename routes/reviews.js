// DESTRUCTURARE ROUTES REVIEWS
const express = require('express');
const router = express.Router({ mergeParams: true }); // pentru a destructura in fisiere diferite. mergeParams: true pentru a putea folosi mai multi parametri (id campground + id review in link)
const reviewsController = require('../controllers/reviewsControl')
const catchAsync = require('../utils/catchAsync') // introducere catch din fisierul catchAsync

const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware') // import middleware pentru isLoggedIn

//------------------------------------

// REVIEW ROUTES START

// Add review route
router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.addReview))

// Delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview))

// REVIEW ROUTES END

//------------------------------------

module.exports = router;