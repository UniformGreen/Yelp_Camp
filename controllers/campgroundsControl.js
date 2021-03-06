const Campground = require('../models/campground'); // adaugare model pentru a putea creea un nou campground
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

// SHOW CAMPGROUNDS ROUTE

module.exports.index = async (req, res) => {
    

    let currentPage = Number(req.query.page);
    console.log({
        currentPage
    });

    if (!currentPage || currentPage < 1)
    // if client req /index w/o ?page 
    {
        currentPage = 1;
        // get campgrounds from the database
        req.session.campgrounds = await Campground.find({}).limit(1000);

        // Initialize Pagination
        let len = (req.session.campgrounds).length;
        req.session.pagination = {
            totalItems: len, // total # of campgrounds
            itemsPerPage: 6,
            totalPages: Math.ceil(len / 6) // total # of pages
        }
    }

    if (!req.session.pagination || !req.session.campgrounds) res.redirect('campgrounds/');

    

    const {
        itemsPerPage,
        totalItems,
        totalPages
    } = req.session.pagination;
    let start = (currentPage - 1) * itemsPerPage;
    let end = currentPage * itemsPerPage;
    if (end > totalItems) end = totalItems;

    const campgrounds = (req.session.campgrounds);
    res.render('campgrounds/', {
        campgrounds,
        totalPages,
        currentPage,
        start,
        end
    });
    
}

// Add campground system route. !!pagina de adaugare (new) trebuie sa fie mereu inaintea paginii de afisare cu ID

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}


// Create Campground

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground); // new campground
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })) // takes image path and filaname from multer and sets it as images to save into mongo
    campground.author = req.user._id;
    await campground.save(); // upload campground to database
    req.flash('success', 'Successfully made a new campground!') // Mesaj de confirmare
    res.redirect(`/campgrounds/${campground._id}`); // redirect to details page
}

// SHOW CAMPGROUNDS

module.exports.showCampground = async (req, res) => {
    const campground = await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if (!campground) {
        req.flash('error', '404: Cannot find the campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
    console.log(campground.images)

}

// EDIT CAMPGROUNDS 

module.exports.renderEditCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', '404: Cannot find the campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

// UPDATE CAMPGROUNDS

module.exports.saveCampground = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); // .. pentru a updata tot ce e cu name = campground[] 
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })) // takes image path and filaname from multer and sets it as images to save into mongo
    campground.images.push(...imgs)  // ... spreads the array
    const newLocation = req.body.location
    console.log(newLocation)

    // If Location was changed
    if (newLocation !== campground.location) {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()
        campground.geometry = geoData.body.features[0].geometry;
    }


    await campground.save()
    // deleting images from MONGO
    if (req.body.deleteImages) {
        // deleting images from claudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }


    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

// DELETE CAMPGROUNDS

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Your campground has been deleted!')
    res.redirect('/campgrounds');
}