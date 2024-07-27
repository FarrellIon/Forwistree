import express from "express";
import { eventController } from "../../../controllers/admin/event";
import multer from "multer";
import { ensureAuthenticated } from "../../../utils/checkauth";

const upload = multer();
const router = express.Router();
const protectedRouter = express.Router();

router.route('/').get(eventController.get);
router.route('/ongoing').get(eventController.getOngoingEvent);
router.route('/:id').get(eventController.getOne);

protectedRouter.use(ensureAuthenticated);
protectedRouter.post('/', upload.fields([
    { name: 'gambar_event' }
]), eventController.create);
protectedRouter.patch('/:id', upload.fields([
    { name: 'gambar_event' }
]), eventController.update);
protectedRouter.route('/:id').delete(eventController.delete);

router.use('/', protectedRouter);

export default router;