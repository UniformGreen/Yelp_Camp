const mongoose = require('mongoose');
const cities = require('./cities'); // adaugare fisier sities pentru a putea fi vazut in acest fisier
const { places, descriptors } = require('./seedHelpers') // adaugare places si descriptors din fisierul seedHelpers
const Campground = require('../models/campground') // adaugare model pentru a putea creea un nou campground
const { getLastUpdated } = require('../utils/functions')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, { // conectare la baza de date
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // afiseaza erorile in consola (daca apar)
db.once("open", () => { // in momentul in care s-a conectat, se va afisa in consola mesajul
    console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]; // alegerea unui numar aleator dintr-un array


const seedDB = async () => {
    await Campground.deleteMany({}); // sterge tot din baza de date
    for (let i = 0; i < 50; i++) { // adaugarea a 50 de orase aleatoare in tabelul campgrounds
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61082d662542c500159dfb70',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`, // adaugare de titlu aleator din seedHelpers.js
            images: [
                {
                    url: 'https://res.cloudinary.com/cgpetraru/image/upload/v1627911601/YelpCamp/rgudu28lpayyxjkdwfct.jpg',
                    filename: 'YelpCamp/ottuajenak9wati4oaoq'
                },
                {
                    url: 'https://res.cloudinary.com/cgpetraru/image/upload/v1627911601/YelpCamp/pieqqf4c2upb7uffuamf.jpg',
                    filename: 'YelpCamp/pbvtuubfc6d2ns0pst5b'
                }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero similique amet, unde ipsa voluptatem laudantium impedit consequatur temporibus iusto suscipit nisi rerum rem fugiat. Nisi perferendis dolore laboriosam enim beatae.',
            price,
            geometry: {
                "coordinates": [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ],
                "type": "Point"
            },
            createdAt: Date.now()
        })
        await camp.save();
    }
}

seedDB().then(() => {  // salveaza si inchide conexiunea
    console.log("BYE")
    mongoose.connection.close()
});