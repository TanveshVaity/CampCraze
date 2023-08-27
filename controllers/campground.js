const Campground = require("../models/campground");
const errorHandler = require("../utils/ErrorAsync");
const {cloudinary} = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = errorHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

module.exports.newCampgroundForm = errorHandler(async (req, res) => {
    res.render("campgrounds/new");
});

module.exports.createNewCampground = errorHandler(async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));    
    campground.author = req.user._id;
    await campground.save();
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
    const newCampground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    newCampground.images.push(...imgs);
    await newCampground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await newCampground.updateOne({$pull : {images : {filename: {$in: req.body.deleteImages}}}})
    }
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