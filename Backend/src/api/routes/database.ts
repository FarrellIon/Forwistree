import express from "express";
import adminRouter from "./database/admin";
import collectionRouter from "./database/collection";
import masterDataRouter from "./database/master-data";
import pengajuanRouter from "./database/pengajuan";

const router = express.Router();

//Admin
router.use('/admin', adminRouter);

//Collections
router.use('/collection', collectionRouter);

//Master Data
router.use('/master-data', masterDataRouter);

//Pengajuan
router.use('/pengajuan', pengajuanRouter);

export default router;