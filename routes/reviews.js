const express = require("express");
const router = express.Router({mergeParams: true});
const {isLoggedIn, reviewValidation} = require("../middlleware");
const reviews = require("../controllers/reviews");


router.post("/", reviewValidation, isLoggedIn, reviews.createReview);
router.delete("/:reviewId", reviews.deleteReview);

module.exports = router;


