const { assert } = require('joi');
const User = require('../models/user');

//------------------------------------

// USER REGISTER ROUTES START

// RENDER REGISTER PAGE

module.exports.renderRegister = (req, res) => {
    if(req.isAuthenticated()){
        req.flash('warning', 'You are already signed in!')
        res.redirect('/campgrounds')
    }
    res.render('users/register')
}

// SUBMIT REGISTRATION

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(user, registeredUser)
        req.login(registeredUser, err => { // login automat dupa inregistrare
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp')
            res.redirect('/campgrounds')
        }) 
    } catch (e) {
        // assert.equal(e.errors['email'].message, 'Email already in use!')
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

// USER REGISTER ROUTES END

//------------------------------------

// USER LOGIN ROUTES START

// RENDER LOGIN PAGE

module.exports.renderLogin = (req, res) => {
    if(req.isAuthenticated()){
        req.flash('warning', 'You are already signed in!')
        res.redirect('/campgrounds')
    }
    res.render('users/login')
    
}

// SUBMIT LOGIN

module.exports.userLogin = (req, res) => {
    req.flash('success', `Welcome Back!`)
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

// USER LOGIN ROUTES END

//------------------------------------

// USER LOGOUT ROUTES START

module.exports.userLogout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!')
    res.redirect('/')
}

// USER LOGOUT ROUTES END
