const express = require("express");
const router = express.Router();
const {isLoggedIn, campgroundValidation, isAuthor} = require("../middlleware");
const campgrounds = require("../controllers/campground");
const multer = require('multer');
const {storage} = require("../cloudinary/index");
const upload = multer({ storage });

router.route("/")
    .get(campgrounds.index)
    .post( isLoggedIn, upload.array("campground[image]"), campgroundValidation, campgrounds.createNewCampground);

router.get("/new", isLoggedIn,campgrounds.newCampgroundForm);

router.route("/:id")
        .get(campgrounds.showCampground)
        .put(isLoggedIn, isAuthor, upload.array('campground[image]'), campgroundValidation, campgrounds.updatedCampground)
        .delete(campgrounds.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor,campgrounds.editCampgroundForm);

module.exports = router;