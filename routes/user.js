const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

router.route("/register")
        .get(users.registerForm)
        .post(users.registerUser);

router.route("/login")
        .get(users.loginForm)
        .post(
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }) ,
        users.loginUser
        );

router.get("/logout", users.logoutUser);



module.exports = router;