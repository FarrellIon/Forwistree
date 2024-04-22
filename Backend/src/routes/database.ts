import express from "express";
import masterDataRouter from "./database/master-data";

const router = express.Router();

router.use('/master-data', masterDataRouter);

export default router;