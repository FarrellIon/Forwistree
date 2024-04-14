const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const booksRoute = require('./routes/books')

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded());

app.use(cookieParser());
app.use(
    session({
        secret: 'asjdflksfd',
        resave: false,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
    next();
})

app.use('/books', booksRoute);

app.listen(PORT, () => console.log(`Running Express Server from Port ${PORT}!`));