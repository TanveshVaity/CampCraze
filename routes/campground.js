const express = require("express");
const router = express.Router();
const {isLoggedIn, campgroundValidation, isAuthor} = require("../middlleware");
const campgrounds = require("../controllers/campground");

router.route("/")
        .get(campgrounds.index)
        .post(campgroundValidation, isLoggedIn, campgrounds.createNewCampground);

router.get("/new", isLoggedIn,campgrounds.newCampgroundForm);

router.route("/:id")
        .get(campgrounds.showCampground)
        .put(isLoggedIn, isAuthor, campgroundValidation, campgrounds.updatedCampground)
        .delete(campgrounds.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor,campgrounds.editCampgroundForm);

module.exports = router;