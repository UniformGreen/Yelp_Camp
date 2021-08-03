const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose') // Import passport local mongoose pentru a putea crea autentificare cu passport pentru db mongo

//------------------------------------

// DEFINE USER SCHEMA START

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose); // adauga la schema automat field de username si parola

// DEFINE USER SCHEMA END

//------------------------------------

// CUSTOM EMAIL VALIDATION START

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000 && error.keyValue.email) {
        next(new Error('Email is already in use'))
    } else {
        next(error)
    }
})

// CUSTOM EMAIL VALIDATION END

//------------------------------------

// EXPORT USER SCHEMA START

module.exports = mongoose.model('User', userSchema)

// EXPORT USER SCHEMA END