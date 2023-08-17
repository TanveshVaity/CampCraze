const express = require("express");
const router = express.Router();
const User = require("../models/user");
const errorHandler = require("../utils/ErrorAsync");
const passport = require("passport");
const{isLoggedIn} = require("../middlleware");

router.get("/register", (req,res)=>{
    res.render("user/register");
})

router.post("/register", errorHandler(async(req,res)=>{
    try{
        const{email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err)=>{
            if (err) {
                req.flash("error", "Error logging out");
                return res.redirect("/campgrounds");
            }
            req.flash("success", "Welcome to CampCraze");
            res.redirect("/campgrounds");
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
}));

router.get("/login", (req,res)=>{
    res.render("user/login");
});

router.post("/login", 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }) ,
    async(req, res) => {
        req.flash("success", "Welcome Back!!");
        const redirectUrl = req.session.returnTo || "/campgrounds"; 
        res.redirect(redirectUrl);
        delete req.session.returnTo; 
    }
);

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Error logging out");
            return res.redirect("/campgrounds");
        }
        req.flash("success", "Goodbye!!!");
        res.redirect("/campgrounds");
    });
});



module.exports = router;