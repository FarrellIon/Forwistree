import express from "express";
import kategoriRouter from "./master-data/kategori";

const router = express.Router();

router.use('/kategori', kategoriRouter);

export default router;