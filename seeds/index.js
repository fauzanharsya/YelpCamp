const axios = require('axios');
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
})


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '68ace7bb8dcf8b3fa2af95a6',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, dignissimos sint. Tempora fuga ab impedit voluptatibus dolore cupiditate, adipisci at perferendis repellendus dicta! Quidem magni iure minus similique quod architecto?',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dej7fxqqa/image/upload/v1756540696/YelpCamp/hsvfhdq6rd2fr9o2j7gy.avif',
          filename: 'YelpCamp/hsvfhdq6rd2fr9o2j7gy'
        },
        {
          url: 'https://res.cloudinary.com/dej7fxqqa/image/upload/v1756540694/YelpCamp/fnxiint4upu3jowss3dp.jpg',
          filename: 'YelpCamp/fnxiint4upu3jowss3dp'
        }
      ],
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

