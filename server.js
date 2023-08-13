require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const campGround = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const errorHandler = require("./utils/ErrorAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const {campgroundSchema} = require("./schemas");

const app = express();
const port = process.env.PORT || 5000;

// Database connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.catch(error => {
    console.error("MongoDB connection error:", error);
});
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error"));
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const campgroundValidation = (req,res,next) =>{
    const{error} = campgroundSchema.validate(req.body);
    if(error){
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message , 400); 
    }
    else{
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", errorHandler(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", errorHandler(async (req, res) => {
    res.render("campgrounds/new");
}));

app.post("/campgrounds",campgroundValidation, errorHandler(async (req, res) => {
    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get("/campgrounds/:id",errorHandler(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit", errorHandler(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", errorHandler(async (req, res) => {
    const newCampground = await campGround.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.delete("/campgrounds/:id", errorHandler(async(req,res)=>{
    await campGround.findOneAndDelete({"_id": req.params.id});
    res.redirect("/campgrounds");
}));

app.all("*", errorHandler(async(req,res,next)=>{
    next(new ExpressError("Something Went Wrong", 500));
}));

app.use((err,req,res,next)=>{
    const {statusCode, message} = err;
    res.render("error", {err}).status(statusCode);
})

app.listen(port, () => {
    console.log("Server is running on port 5000");
});