import express from "express";
import { pengajuanController } from "../../../controllers/pengajuan/pengajuan";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route('/').get(pengajuanController.get);
router.post('/', upload.fields([
    { name: 'file_sinopsis' }
]), pengajuanController.create);
router.patch('/:id', upload.fields([
    { name: 'file_sinopsis' }
]), pengajuanController.update);
router.route('/:id').get(pengajuanController.getOne).delete(pengajuanController.delete);

// router.post('/accept/:id', upload.none(), pengajuanController.accept);

export default router;