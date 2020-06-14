/* Requirement of libraries */
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      User = require('./models/user'),
      path = require('path');

/* Routing requires */
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/post');
const profileRoutes = require('./routes/profile')
const commentRoutes = require('./routes/comment')

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
app.use(express.static("public"));
app.use('/static', express.static(path.join(__dirname, 'public')));
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

/* Routing middleware */
app.use(indexRoutes);
app.use(postRoutes);
app.use(profileRoutes);
app.use(commentRoutes);

/* server port */
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}
app.listen(port, () => {
    console.log('The app is listening.')
});
