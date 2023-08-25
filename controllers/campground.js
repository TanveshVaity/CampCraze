const Campground = require("../models/campground");
const errorHandler = require("../utils/ErrorAsync");

module.exports.index = errorHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

module.exports.newCampgroundForm = errorHandler(async (req, res) => {
    res.render("campgrounds/new");
});

module.exports.createNewCampground = errorHandler(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));    
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.showCampground = errorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({path:"reviews", populate:{path:"author"}}).populate("author");
    if (!campground) {
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
});

module.exports.editCampgroundForm = errorHandler(async (req, res) => {
    const{id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");w
    }
    if(!campground.author.equals(req.user.id)){
        req.flash("error", "You don't have permission to do that!!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    res.render("campgrounds/edit", { campground });
});

module.exports.updatedCampground = errorHandler(async (req, res) => {
    const { id } = req.params;
    const newCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
});

module.exports.deleteCampground = errorHandler(async(req,res)=>{
    try {
        await Campground.findOneAndDelete({"_id": req.params.id});
        req.flash('success', 'Successfully deleted campground!');
        res.redirect("/campgrounds");
    } catch (err) {
        req.flash('error', 'Error deleting campground.');
        res.redirect("/campgrounds");
    }
});