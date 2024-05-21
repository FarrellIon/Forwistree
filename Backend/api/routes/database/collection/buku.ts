import express from "express";
import { bukuController } from "../../../controllers/collection/buku";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(bukuController.get);
router.post('/', upload.fields([
    { name: 'file_sinopsis' },
    { name: 'gambar_buku' }
]), bukuController.create);
router.patch('/:id', upload.fields([
    { name: 'file_sinopsis' },
    { name: 'gambar_buku' }
]), bukuController.update);
router.route('/:id').get(bukuController.getOne).delete(bukuController.delete);

export default router;