const mongoose = require('mongoose');

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('Connected to dB'))
    .catch((err) => console.log(err));
