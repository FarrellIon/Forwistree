const { Router } = require("express");
const passport = require('passport');
const { hashPassword, comparePassword } = require('../utils/helpers');
const User = require('../database/schemas/User');

const router = Router();

// router.get('/login', async (request, response) => {
//     const { email, password } = request.body;
//     if (!email || !password) return response.sendStatus(400);
//     const userDB = await User.findOne({ email });
//     if (!userDB) return response.sendStatus(401);
//     const isValid = comparePassword(password, userDB.password);
//     if(isValid){
//         request.session.user = userDB;
//         return response.sendStatus(200);
//     }else{
//         return response.sendStatus(401);
//     }
// })

router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log('Logged In');
    res.sendStatus(200);
});

router.post('/register', async (request, response) => {
    const { email } = request.body;
    const userDB = await User.findOne({
        $or: [{email}]
    });
    if(userDB){
        response.status(400).send({ msg: 'User already exists!' });
    }else{
        const password = hashPassword(request.body.password);
        const newUser = await User.create({ password, email });
        response.sendStatus(201);
    }
})

module.exports = router;