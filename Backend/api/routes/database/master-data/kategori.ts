import express from "express";
import { kategoriController } from "../../../controllers/master-data/kategori";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(kategoriController.get)
router.route('/:id/edit').get(kategoriController.edit)
router.route('/random').get(kategoriController.getRandom)
router.post('/', upload.none(), kategoriController.create);
router.patch('/:id', upload.none(), kategoriController.update);
router.route('/:id').get(kategoriController.getOne).delete(kategoriController.delete);

export default router;