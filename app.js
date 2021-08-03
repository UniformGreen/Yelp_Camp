if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // ENV package is used to hide the cloudinary secret key (cloudinary is used to store images)
}



const express = require('express'); // import express
const path = require('path'); // adaugare requirement path
const mongoose = require('mongoose');
const methodOverride = require('method-override') // NPM package pentru a putea folosi methods de update, delete
const ejsMate = require('ejs-mate') // ejs-mate pentru a putea crea boilerplate-uri (html-uri modulare)
const session = require('express-session') // adaugare session pentru a putea folosi flash messages 
const flash = require('connect-flash') // folosit pentru a genera mesaje de tip flash (notificari)
const ExpressError = require('./utils/ExpressError') // introducere clasa de erori din fisierul ExpressError
const passport = require('passport'); // import module pentru strategii de autentificare
const localStrategy = require('passport-local'); // import module pentru autentificare cu cont creat pe baza de date
const User = require('./models/user'); // import user schema
const Campground = require('./models/campground');
const helmet = require('helmet')
const MongoDBStore = require('connect-mongo')(session)

//------------------------------------

// ROUTES START

const userRoutes = require('./routes/users') // route users
const campgroundRoutes = require('./routes/campgrounds') // adaugare route campgrounds
const reviewRoutes = require('./routes/reviews'); // adaugare route reviews
const campground = require('./models/campground');

// ROUTES END

//------------------------------------

// DATABASE CONNECTION START

const dbUrl = process.env.DB_CONNECT || 'mongodb://localhost:27017/yelp_camp'
// 'mongodb://localhost:27017/yelp_camp'
mongoose.connect(dbUrl, { // conectare la baza de date
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // afiseaza erorile in consola (daca apar)
db.once("open", () => { // in momentul in care s-a conectat, se va afisa in consola mesajul
    console.log("Database connected");
})

// DATABASE CONNECTION END

//------------------------------------

// SERVER & UTILITIES CONFIGURATION START

const app = express(); // pentru a porni express si a folosi set, get, put etc

app.engine('ejs', ejsMate) // pornire ejs-mate
app.set('view engine', 'ejs'); // setare ejs pentru a putea fi folosit
app.set('views', path.join(__dirname, 'views')) // pentru a vedea folderul views

app.use(express.urlencoded({ extended: true })) // parsare req.body
app.use(methodOverride('_method')) // pentru a putea folosi methodOverride in link-uri
app.use(express.static(path.join(__dirname, 'public'))) // pentru a putea folosi scripturile gasite in folderul 'public'
app.use(helmet({ contentSecurityPolicy: false }))

// SERVER & UTILITIES CONFIGURATION START

//------------------------------------

// SESSION & COOKIES CONFIGURATION START

// connect mongo to session

const secret = process.env.CLOUDINARY_SECRET || 'thisshouldbeabettersecret!'

const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60 // 24 hours * 60 minutes * 60 seconds (se calc in secunde, nu milisecunde)
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = { // session config pentru session si cookies
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1000 ms * 60 sec * 60 min * 24h * 7 days. Expirare cookie in o saptamana. Date.now() returneaza in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7 // max 7 zile in milisecunde
    }
}
app.use(session(sessionConfig));
app.use(flash());

// SESSION CONFIGURATION END

//------------------------------------

// AUTHENTICATION SESSION CONFIGURATION START

app.use(passport.initialize()); // pentru aplicatiile EXPRESS, passport trebuie sa fie initializat
app.use(passport.session()); // se foloseste passport.session() pentru a putea pastra userul logat pe parcursul sesiunii (pana la data limita)
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// AUTHENTICATION SESSION CONFIGURATION END

//------------------------------------

// MIDDLEWARE FLASH START

app.use((req, res, next) => {
    //Verifica daca este logat user-ul sau nu pentru a afisa sau nu butonul de login
    if (!['/login', '/register'].includes(req.originalUrl) && req.query._method !== ['DELETE', 'PUT']) {
        req.session.returnTo = req.originalUrl // after login, return to the previous page. returnTo comes from users.js
    }
    res.locals.currentUser = req.user;
    // console.log(req.session)
    // afisare mesaje de succes/error 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    next();
})

// MIDDLEWARE FLASH END

//------------------------------------

// ADD ROUTES START

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => { //routing pe home
    res.render('home')
})

// ADD ROUTES END

//------------------------------------

// ERROR HANDLING START

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Basic error handler care aduce din fisierul ExpressEror status code-ul erorii si mesajul
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!' // mesaj default (in cazul in care nu este gasit un error code)
    console.log(err.message)
    res.status(statusCode).render('error', { err }) // genereaza pagina error
})

// ERROR HANDLING END

//------------------------------------

const port = process.env.PORT || 3000

app.listen(port, () => { // utilizare port 3000
    console.log(`I LOVE YOU ${port}`)
})