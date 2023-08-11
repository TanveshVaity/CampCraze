require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const campGround = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
    const newCampground = await campGround.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${newCampground._id}`);
});

app.delete("/campgrounds/:id", async(req,res)=>{
    await campGround.findOneAndDelete({"_id": req.params.id});
    res.redirect("/campgrounds");
})

app.listen(port, () => {
    console.log("Server is running on port 5000");
});
