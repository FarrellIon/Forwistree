import express from "express";
import pengajuanRouter from "./pengajuan/pengajuan";

const router = express.Router();

router.use('/pengajuan', pengajuanRouter);

export default router;