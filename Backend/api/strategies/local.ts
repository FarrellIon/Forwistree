import passport from 'passport';
import { Strategy } from 'passport-local';
import { Admins } from '../database/schemas/admin/admins';
import { comparePassword } from '../utils/hashing';

passport.use(
    new Strategy(async (username, password, done) => {
        if(!username || !password){
            done(new Error('Username atau password masih kosong'), undefined);
        }
        try{
            const adminDB = await Admins.findOne({ username });
            if (!adminDB) throw new Error('Admin dengan nama tersebut tidak ditemukan');
            const isValid = comparePassword(password, adminDB.password.toString());
            if(isValid){
                done(null, adminDB);
            }else{
                done(null, undefined);
            }
        }catch(err){
            done(err, undefined);
        }
    })
);

passport.serializeUser((admin: any, done) => {
    done(null, admin._id)
});

passport.deserializeUser(async (id: string, done) => {
    try{
        const admin = await Admins.findById(id);
        if(!admin) throw new Error('Admin tidak ditemukan');
        done(null, admin);
    }catch(err){
        done(err, null);
    }
})
