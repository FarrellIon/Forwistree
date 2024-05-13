import express from "express";
import passport from 'passport';
import authRegisterController from "../controllers/register";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post('/login', upload.none(), passport.authenticate('local'), (req, res) => {
    if(req.user){
        res.send('Berhasil Login');
    }else{
        res.send('Error ketika login');
    }
});
router.post('/register', upload.none(), authRegisterController);
router.post('/logout', function(req, res, next){
    if(req.user){
        req.logout(function(err) {
            if (err) { return next(err); }
            res.send('Berhasil Logout');
        });
    }else{
        res.status(400).send('Belum login');
    }
});

export default router;