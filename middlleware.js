const {campgroundSchema , reviewSchema} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    next();
};

module.exports.campgroundValidation = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
};
module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You don't have permission to do that!!!");
        res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
};

module.exports.reviewValidation = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message , 400); 
    }
    else{
        next();
    }
};