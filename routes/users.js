const express = require('express');
const router = express.Router();
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')

const userController = require('../controllers/usersControl')

//------------------------------------

// USER REGISTER ROUTES START

router.route('/register')
    .get(userController.renderRegister) // render register page
    .post(catchAsync(userController.registerUser)) // upload registered user to database

// USER REGISTER ROUTES END

//------------------------------------

// USER LOGIN ROUTES START

router.route('/login')
    .get(userController.renderLogin) // render login page
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.userLogin) // send login request

// USER LOGIN ROUTES END

//------------------------------------

// USER LOGOUT ROUTES START

router.get('/logout', userController.userLogout)

// USER LOGOUT ROUTES END

module.exports = router;