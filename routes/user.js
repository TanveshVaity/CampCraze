const express = require("express");
const router = express.Router();
const User = require("../models/user");
const errorHandler = require("../utils/ErrorAsync");

router.get("/register", (req,res)=>{
    res.render("user/register");
})

router.post("/register", errorHandler(async(req,res)=>{
    try{
        const{email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user, password);
        req.flash("success", "Welcome to CampCraze");
        res.redirect("/campgrounds");
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
}));

module.exports = router;