/* Requirement of libraries */
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      User = require('./models/user')


/* Database connection */
let db = process.env.MONGODB_URL;
const dbObject = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};
if (db == null || db == "") {
    db = 'mongodb://localhost:27017/foodie';
}
mongoose.connect(db, dbObject);

/* Configuration and middleware */
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));

/* Passport configuration */
app.use(require('express-session')({
    secret: 'Here goes a long text that will hash the password or something like that, idk',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// definition of some local variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.path = req.path;
    next();
});

/* First routing */
// routing will later go to their own files
app.get('/', (req, res) => {
    res.render('index');
});

/* Register routes */
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.user.name,
        lastname: req.body.user.lastname,
        email: req.body.user.email,
        username: req.body.username
    });
    let password = req.body.password;

    User.register(newUser, password, (error, user) => {
        if (error) {
            console.log(error);
            res.redirect('/register');
        }

        passport.authenticate('local')(req, res, () => {
            res.redirect('/dashboard');
        });
    });
});

/* Login routes */
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
    })(req, res);
});

/* Logout route */
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

/* Dashboard route */
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

/* Profile viewer (show) */
app.get('/u/:username', (req, res) => {
    res.render('profile');
});
console.log(User)


/* server port */
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}
app.listen(port, () => {
    console.log('The app is listening.')
});