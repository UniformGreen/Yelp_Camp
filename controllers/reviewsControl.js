const Review = require('../models/review'); // adaugare model review
const Campground = require('../models/campground') // adaugare model pentru a putea creea un nou campground

// ADD REVIEW

module.exports.addReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review added!')
    res.redirect(`/campgrounds/${campground._id}`);
}

// DELETE REVIEW

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // scoate reviewId din array-ul de reviews din cadrul Campground-ului
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review has been deleted!')
    res.redirect(`/campgrounds/${id}`)
}