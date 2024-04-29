import express from "express";
import { penulisController } from "../../../controllers/master-data/penulis";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(penulisController.get)
router.post('/', upload.none(), penulisController.create);
router.patch('/:id', upload.none(), penulisController.update);
router.route('/:id').get(penulisController.getOne).delete(penulisController.delete);

export default router;