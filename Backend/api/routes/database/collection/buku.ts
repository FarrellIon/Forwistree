import express from "express";
import { bukuController } from "../../../controllers/buku/buku";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(bukuController.get);
router.post('/', upload.fields([
    { name: 'file_sinopsis', maxCount: 1 },
    { name: 'gambar_buku', maxCount: 5 }
]), bukuController.create);
router.patch('/:id', upload.fields([
    { name: 'file_sinopsis', maxCount: 1 },
    { name: 'gambar_buku', maxCount: 5 }
]), bukuController.update);
router.route('/:id').get(bukuController.getOne).delete(bukuController.delete);

export default router;