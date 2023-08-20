const User = require("../models/user");
const errorHandler = require("../utils/ErrorAsync");


module.exports.registerForm = (req,res)=>{
    res.render("user/register");
};

module.exports.registerUser = errorHandler(async(req,res)=>{
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
});

module.exports.loginForm = (req,res)=>{
    res.render("user/login");
};

module.exports.loginUser = async(req, res) => {
    req.flash("success", "Welcome Back!!");
    const redirectUrl = req.session.returnTo || "/campgrounds"; 
    res.redirect(redirectUrl);
    delete req.session.returnTo; 
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Error logging out");
            return res.redirect("/campgrounds");
        }
        req.flash("success", "Goodbye!!!");
        res.redirect("/campgrounds");
    });
};