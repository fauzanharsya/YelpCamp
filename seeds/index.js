require('dotenv').config();

const axios = require('axios');
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const { cloudinary } = require("../cloudinary")

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
})

async function getRandomImage() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: process.env.UNSPLASH_ACCESS_KEY,
        collections: 1114848,
      },
    });
    return resp.data.urls.regular;
  } catch (err) {
    console.error("Error fetching from Unsplash:", err.message);
  }
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 25; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const images = [];
    for (let j = 0; j < 2; j++) {
      const imageUrl = await getRandomImage();
      if (imageUrl) {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(
            imageUrl,
            { folder: 'YelpCamp' }
          )
          images.push({
            url: uploadedResponse.secure_url,
            filename: uploadedResponse.public_id
          })
        } catch (uploadErr) {
          console.log("Error uploading to cloudinary: ", uploadErr.message);
        }
      }
    }

    const camp = new Campground({
      author: '68bd765ce0ed4f3ff5400aa7',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit atque earum dicta excepturi aut sint id incidunt ratione totam dolorem ullam nostrum, omnis ut officiis eveniet explicabo iure laudantium. Aliquid?',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images: images,
    })
    await camp.save();
  }
}

seedDB()
  .then(() => {
    console.log("success seeding");
    mongoose.connection.close();
    console.log('Database connection closed')
  })
  .catch(err => {
    console.log("Error seeding");
    console.log(err);
    mongoose.connection.close();
  })
