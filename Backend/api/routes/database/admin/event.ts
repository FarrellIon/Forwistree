import express from "express";
import { eventController } from "../../../controllers/admin/event";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(eventController.get);
router.post('/', upload.fields([
    { name: 'gambar_event' }
]), eventController.create);
router.patch('/:id', upload.fields([
    { name: 'gambar_event' }
]), eventController.update);
router.route('/:id').get(eventController.getOne).delete(eventController.delete);

export default router;