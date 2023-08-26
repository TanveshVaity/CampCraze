const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/w_300,h_300,c_limit");
});
const CampgroundSchema = new Schema({
    title : String,
    price : Number,
    description : String,
    location : String,
    images:[imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }]
});

CampgroundSchema.post("findOneAndDelete",  async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);