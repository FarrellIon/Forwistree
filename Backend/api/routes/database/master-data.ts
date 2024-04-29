import express from "express";
import kategoriRouter from "./master-data/kategori";
import penulisRouter from "./master-data/penulis";

const router = express.Router();

router.use('/kategori', kategoriRouter);
router.use('/penulis', penulisRouter);

export default router;