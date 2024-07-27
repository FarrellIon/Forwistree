import express from "express";
import { kategoriController } from "../../../controllers/master-data/kategori";
import multer from "multer";
import { ensureAuthenticated } from "../../../utils/checkauth";

const upload = multer();
const router = express.Router();
const protectedRouter = express.Router();

router.route('/').get(kategoriController.get)
router.route('/:id').get(kategoriController.getOne)
router.route('/get/random').get(kategoriController.getRandom)

protectedRouter.use(ensureAuthenticated);
protectedRouter.route('/:id/edit').get(kategoriController.edit)
protectedRouter.post('/', upload.none(), kategoriController.create);
protectedRouter.patch('/:id', upload.none(), kategoriController.update);
protectedRouter.route('/:id').delete(kategoriController.delete);

router.use('/', protectedRouter);

export default router;