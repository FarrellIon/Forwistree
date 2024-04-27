import express from "express";
import masterDataRouter from "./database/master-data";
import bukuRouter from "./database/collection/buku";

const router = express.Router();

//Collections
router.use('/buku', bukuRouter);

//Master Data
router.use('/master-data', masterDataRouter);

export default router;