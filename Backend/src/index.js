//Plugins
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

//Routes
const booksRoute = require('./routes/books');
const authRoute = require('./routes/auth');

const app = express();
const PORT = 3001;

//DB
require('dotenv').config();
require('./database');

//Init
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());
app.use(
    session({
        secret: 'asjdflksfd',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./strategies/local');

//Doesnt need auth
app.use('/auth', authRoute);

//Check user auth
app.use((req, res, next) => {
    if(req.user) next();
    else{
        res.sendStatus(401);
    }
})

//Needs auth
app.use('/books', booksRoute);





app.listen(PORT, () => console.log(`Running Express Server from Port ${PORT}!`));