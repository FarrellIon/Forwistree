const passport = require('passport');
const { Strategy } = require('passport-local');
const { hashPassword, comparePassword } = require('../utils/helpers');
const User = require('../database/schemas/User');

passport.serializeUser((user, done) => {
    console.log("Serializing user...");
    console.log(user);
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user...");
    console.log(id);
    try{
        const user = await User.findById(id);
        if(!user) throw new Error('User not found');
        console.log(user);
        done(null, user);
    }catch(err){
        console.log(err);
        done(err, null);
    }
})

passport.use(
    new Strategy({
        usernameField: 'email',
    }, async (email, password, done) => {
        if(!email || !password){
            done(new Error('Bad Request, Missing credentials'), null);
        }
        try{
            const userDB = await User.findOne({ email });
            if (!userDB) throw new Error('User not found');
            const isValid = comparePassword(password, userDB.password);
            if(isValid){
                done(null, userDB);
            }else{
                done(null, null);
            }
        }catch(err){
            done(err, null);
        }
    })
);