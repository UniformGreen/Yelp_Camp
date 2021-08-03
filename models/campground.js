// Model pentru baza de date pentru campground-uri

const mongoose = require('mongoose'); // adaugare mongoose
const Review = require('./review'); // adaugare review pentru as putea fi folosit in middleware de stergere
const Schema = mongoose.Schema; // constanta ce va fi folosita in relatii

const ImageSchema = new Schema({
    url: String,
    filename: String
})



// carousel photos size
ImageSchema.virtual('carousel').get(function() {
    return this.url.replace('/upload', '/upload/h_400,w_630')
})
// carousel photos size
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// index thumbnail size
ImageSchema.virtual('indexThumbnail').get(function() {
    return this.url.replace('/upload', '/upload/h_250,w_415')
})

const options = { toJSON: {virtuals: true} } // MONGOOSE does not support virtuals by default.

const CampgroundSchema = new Schema({ // schema baza de date
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [ // relatie One-To-Many
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, options);

CampgroundSchema.virtual('properties.popUpMarkap').get(function() {
    return `<strong><a href = "/campgrounds/${this._id}">${this.title}</a><strong>`
})

// Middleware pentru a sterge review-urile atunci cand campground-ul este sters
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema); // export model pentru a putea fi folosit in alte fisiere