import express from "express";
import { pengajuanController } from "../../../controllers/pengajuan/pengajuan";
import multer from "multer";
import { ensureAuthenticated } from "../../../utils/checkauth";

const upload = multer();
const router = express.Router();
const protectedRouter = express.Router();

router.route('/get/pengaju').get(pengajuanController.getPengaju);
router.route('/').get(pengajuanController.get);
router.route('/:id').get(pengajuanController.getOne)
router.post('/', upload.fields([
    { name: 'file_sinopsis' }
]), pengajuanController.create);
router.patch('/:id', upload.fields([
    { name: 'file_sinopsis' }
]), pengajuanController.update);

//Protected
protectedRouter.use(ensureAuthenticated);
protectedRouter.route('/approve/:id').patch(pengajuanController.approve);
protectedRouter.route('/reject/:id').patch(pengajuanController.reject);
protectedRouter.route('/:id').delete(pengajuanController.delete);

router.use('/', protectedRouter);

export default router;