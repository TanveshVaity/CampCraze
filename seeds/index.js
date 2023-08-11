require('dotenv').config({ path: '../.env' });
const mongoose = require("mongoose");
const campGround = require("../models/campground");
const cities = require("./cities");
const {descriptors, places} = require("./seedHelper");
const axios = require("axios"); 
const apiKey = process.env.UNSPLASH_API_KEY;
const apiUrl = `https://api.unsplash.com/collections/483251/photos/?client_id=${apiKey}`;



//mongoose connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
  
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error"));
connection.once("open", ()=>{
    console.log("MongoDB database connection established successfully");
})

let image = []; 
axios.get(apiUrl)
  .then(response => {
    images = response.data.map(photo => photo.urls.regular);
  })
  .catch(error => {
    console.error('Error fetching images:', error);
  });;

const sampleCamp = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
  
const seed = async()=>{
    await campGround.deleteMany({});
    for(let i=0; i<=50; i++){
        const randomNumber = Math.floor(Math.random()*1000);
        const randomPrice = Math.floor(Math.random()*100);
        const camp = new campGround({
            location: `${cities[randomNumber].city}, ${cities[randomNumber].states}`,
            title: `${sampleCamp(descriptors)}, ${sampleCamp(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique ligula vel nunc rhoncus",
            image: images[i % images.length],
            price: randomPrice
        })
        await camp.save();
    }
}

seed().then(() =>{
    mongoose.connection.close();
});

