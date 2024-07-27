import express from "express";
import { bukuController } from "../../../controllers/collection/buku";
import multer from "multer";
import { ensureAuthenticated } from "../../../utils/checkauth";

const upload = multer();
const router = express.Router();
const protectedRouter = express.Router();

router.route('/').get(bukuController.get);
router.route('/recently-published').get(bukuController.getRecentlyPublished);
router.route('/editors-pick').get(bukuController.getEditorsPick);
router.route('/limited-sale').get(bukuController.getLimitedSale);
router.route('/:id').get(bukuController.getOne)

protectedRouter.use(ensureAuthenticated);
protectedRouter.post('/', upload.fields([
    { name: 'file_sinopsis' },
    { name: 'gambar_buku' }
]), bukuController.create);
protectedRouter.patch('/:id', upload.fields([
    { name: 'file_sinopsis' },
    { name: 'gambar_buku' }
]), bukuController.update);
protectedRouter.route('/:id').delete(bukuController.delete);

router.use('/', protectedRouter);

export default router;