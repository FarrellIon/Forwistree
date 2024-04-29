import express from "express";
import { kategoriController } from "../../../controllers/master-data/kategori";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(kategoriController.get)
router.post('/', upload.none(), kategoriController.create);
router.patch('/:id', upload.none(), kategoriController.update);
router.route('/:id').get(kategoriController.getOne).delete(kategoriController.delete);

export default router;