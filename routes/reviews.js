const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review");
const Campground = require("../models/campground");
const {reviewSchema} = require("../schemas");
const errorHandler = require("../utils/ErrorAsync");
const ExpressError = require("../utils/ExpressError");

const reviewValidation = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message , 400); 
    }
    else{
        next();
    }
}

router.post("/",reviewValidation, errorHandler(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewId", errorHandler(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;

