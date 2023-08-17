const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const errorHandler = require("../utils/ErrorAsync");
const ExpressError = require("../utils/ExpressError");
const {campgroundSchema} = require("../schemas");
const {isLoggedIn} = require("../middlleware");


const campgroundValidation = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};


router.get("/", errorHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", isLoggedIn,errorHandler(async (req, res) => {
    res.render("campgrounds/new");
}));

router.post("/",campgroundValidation, isLoggedIn, errorHandler(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", errorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if (!campground) {
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}));


router.get("/:id/edit", isLoggedIn, errorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash("error", "Cannot find campground!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", errorHandler(async (req, res) => {
    const newCampground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.delete("/:id", errorHandler(async(req,res)=>{
    try {
        await Campground.findOneAndDelete({"_id": req.params.id});
        req.flash('success', 'Successfully deleted campground!');
        res.redirect("/campgrounds");
    } catch (err) {
        req.flash('error', 'Error deleting campground.');
        res.redirect("/campgrounds");
    }
}));

module.exports = router;