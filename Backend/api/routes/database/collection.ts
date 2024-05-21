import express from "express";
import bukuRouter from "./collection/buku";

const router = express.Router();

router.use('/buku', bukuRouter);

export default router;