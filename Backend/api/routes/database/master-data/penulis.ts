import express from "express";
import { penulisController } from "../../../controllers/master-data/penulis";
import multer from "multer";
import { ensureAuthenticated } from "../../../utils/checkauth";

const upload = multer();
const router = express.Router();
const protectedRouter = express.Router();

router.route('/').get(penulisController.get)
router.route('/:id').get(penulisController.getOne)

protectedRouter.use(ensureAuthenticated);
protectedRouter.post('/', upload.none(), penulisController.create);
protectedRouter.patch('/:id', upload.none(), penulisController.update);
protectedRouter.route('/:id').delete(penulisController.delete);

router.use('/', protectedRouter);

export default router;