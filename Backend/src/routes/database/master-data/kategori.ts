import express from "express";
import { kategoriController } from "../../../controllers/master-data/kategori";

const router = express.Router();

router.route('/').get(kategoriController.get).post(kategoriController.create);
router.route('/:id').get(kategoriController.getOne).patch(kategoriController.update).delete(kategoriController.delete);

export default router;