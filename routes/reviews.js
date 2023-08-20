const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review");
const Campground = require("../models/campground");
const errorHandler = require("../utils/ErrorAsync");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn, reviewValidation} = require("../middlleware");


router.post("/", reviewValidation, isLoggedIn, errorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));
router.delete("/:reviewId", errorHandler(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;


