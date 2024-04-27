import express from "express";
import { bukuController } from "../../../controllers/buku/buku";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(bukuController.get);
router.post('/', upload.single('file_sinopsis'), bukuController.create);
router.route('/:id').get(bukuController.getOne).patch(bukuController.update).delete(bukuController.delete);

export default router;