// DESTRUCTURARE ROUTES CAMPGROUNDS

const express = require('express');
const router = express.Router(); // pentru a destructura in fisiere diferite
const ExpressError = require('../utils/ExpressError')


const catchAsync = require('../utils/catchAsync') // introducere catch din fisierul catchAsync
const campgroundsController = require('../controllers/campgroundsControl') // import campground controller

const Campground = require('../models/campground') // adaugare model pentru a putea creea un nou campground
const { isLoggedIn, isAuthor, validateCampground, validateMulter } = require('../middleware'); // import middleware pentru isLoggedIn
const multer = require('multer') // multer is used to parse the file upload
const { storage, whitelist } = require('../cloudinary')
const upload = multer({
    storage,
    limits: { files: 3 },
    fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            cb(new Error('File not supported. Only JPG, JPEG and PNG formats are allowed.'))
        }
        cb(null, true)

    }
}) // uploading to cloudinary


//------------------------------------

// CAMPGROUND ROUTES START

// routes for campground main page (index)
router.route('/')
    .get(catchAsync(campgroundsController.index)) // render all campgrounds
    .post(isLoggedIn, upload.array('image'),  validateCampground, catchAsync(campgroundsController.createCampground)) // create campground (upload to database)

// routes for individual campgrounds

// Add campground system route. !!pagina de adaugare (new) trebuie sa fie mereu inaintea paginii de afisare cu ID
router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

// Routes for individual campgrounds
router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground)) // render individual campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundsController.saveCampground)) // save edited campground to database
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground)) // delete campground

// Edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditCampground)
)

// CAMPGROUND ROUTES END

//------------------------------------

module.exports = router;
