import express from "express";
import { mitraEventController } from "../../../controllers/master-data/mitra_event";
import multer from "multer";
import { ensureAuthenticated } from "../../../utils/checkauth";

const upload = multer();
const router = express.Router();
const protectedRouter = express.Router();

router.route('/').get(mitraEventController.get)
router.route('/:id').get(mitraEventController.getOne)

protectedRouter.use(ensureAuthenticated);
protectedRouter.post('/', upload.fields([
    { name: 'gambar_mitra' }
]), mitraEventController.create);
protectedRouter.patch('/:id', upload.fields([
    { name: 'gambar_mitra' }
]), mitraEventController.update);
protectedRouter.route('/:id').delete(mitraEventController.delete);

router.use('/', protectedRouter);

export default router;