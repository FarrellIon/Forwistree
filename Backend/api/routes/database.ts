import express from "express";
import adminRouter from "./database/admin";
import collectionRouter from "./database/collection";
import masterDataRouter from "./database/master-data";

const router = express.Router();

//Admin
router.use('/admin', adminRouter);

//Collections
router.use('/collection', collectionRouter);

//Master Data
router.use('/master-data', masterDataRouter);

export default router;