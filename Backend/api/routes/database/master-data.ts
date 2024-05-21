import express from "express";
import kategoriRouter from "./master-data/kategori";
import mitraEventRouter from "./master-data/mitra_event";
import penulisRouter from "./master-data/penulis";

const router = express.Router();

router.use('/kategori', kategoriRouter);
router.use('/mitra_event', mitraEventRouter);
router.use('/penulis', penulisRouter);

export default router;