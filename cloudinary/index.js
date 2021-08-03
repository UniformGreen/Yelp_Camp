const cloudinary = require('cloudinary').v2; // cloudinary is used to store images on the cloud
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // used to upload files using multer to cloudinary  

//------------------------------------

// CONFIGURING CLOUDINARY START

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// CONFIGURING CLOUDINARY END

//------------------------------------

// INSTANCIATING CLOUDINARY STORAGE START

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp', 
        // format: ['jpeg', 'png', 'jpg']
    }
})

// INSTANCIATING CLOUDINARY STORAGE END

//------------------------------------

// WHITELIST FORMATS START

const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg'
]

// WHITELIST FORMATS END

//------------------------------------

module.exports = {
    cloudinary,
    storage,
    whitelist
}