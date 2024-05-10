import express from "express";
import passport from 'passport';
import authRegisterController from "../controllers/register";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.get('/login', (req, res) => {
    res.send('Berhasil Login');
});
router.post('/login', upload.none(), passport.authenticate('local'));
router.post('/register', upload.none(), authRegisterController);
router.post('/logout', function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.send('Berhasil Logout');
    });
});

export default router;