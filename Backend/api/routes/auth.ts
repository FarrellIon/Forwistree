import express from "express";
import passport from 'passport';
import authRegisterController from "../controllers/register";
import multer from "multer";
import { ensureAuthenticated } from "../utils/checkauth";
import authDetailController from "../controllers/authdetails";

const upload = multer();
const router = express.Router();

router.route('/details').get(ensureAuthenticated, authDetailController);
router.post('/login', upload.none(), passport.authenticate('local'), (req, res) => {
    if(req.user){
        res.send({
            message: "Berhasil Login",
            id: (req.user as any).id
        });
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