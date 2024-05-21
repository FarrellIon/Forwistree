import express from "express";
import { mitraEventController } from "../../../controllers/master-data/mitra_event";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(mitraEventController.get)
router.post('/', upload.fields([
    { name: 'gambar_mitra' }
]), mitraEventController.create);
router.patch('/:id', upload.fields([
    { name: 'gambar_mitra' }
]), mitraEventController.update);
router.route('/:id').get(mitraEventController.getOne).delete(mitraEventController.delete);

export default router;