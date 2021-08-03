const { campgroundSchema, reviewSchema } = require('./joiSchemas') // adaugare schema campground
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground') // adaugare model pentru a putea creea un nou campground
const Review = require('./models/review')

// MIDDLEWARE LOGIN START

module.exports.isLoggedIn = (req, res, next) => {
    // functie login. Verifica daca esti logat. Daca esti logat, continui, daca nu redirect catre login
    if (!req.isAuthenticated()) {
        req.flash('error', 'You are not signed in!')
        return res.redirect('/login')
    }
    next()
}

// MIDDLEWARE LOGIN END

//------------------------------------

// MIDDLEWARE ERROR VALIDATION START

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ') // deoarece error.details este un array de obiecte, trebuie mapat
        
        // pentru a scoate mesajul. In cazul in care sunt mai multe mesaje, se va separa cu ,
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// MIDDLEWARE ERROR VALIDATION END

//------------------------------------

// MIDDLEWARE VERIFY AUTHOR START

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const update = await Campground.findById(id)
    if (!update.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permision to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// MIDDLEWARE VERIFY AUTHOR END

//------------------------------------

// MIDDLEWARE VERIFY REVIEW AUTHOR START

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permision to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// MIDDLEWARE VERIFY REVIEW AUTHOR END

//------------------------------------

// MIDDLEWARE VALIDARE REVIEW START

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ') // deoarece error.details este un array de obiecte, trebuie mapat
        // pentru a scoate mesajul. In cazul in care sunt mai multe mesaje, se va separa cu ,
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// MIDDLEWARE VALIDARE REVIEW END

// module.exports.validateMulter = (error, req, res) => {
//     if(error){
        
//         if(error.message === 'Too many files'){
//             error.message = 'Maximum number of images is 3.'
//             console.log(error.message)
//             req.flash('error', 'Maximum number of images is 3.')
//         }
//     }
