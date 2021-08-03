// Model pentru colectia de review-uri din MongoDB

const mongoose = require('mongoose'); // adaugare mongoose pentru a conecta baza de date la server
const Schema = mongoose.Schema; // constanta ce va fi folosita in relatii pentru prescurtare. Se va scrie Schema.x in loc de mongoose.Schema.x

// Model pentru review-uri
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// Export schema pentru a putea fi folosita in alte fisiere
module.exports = mongoose.model("Review", reviewSchema);