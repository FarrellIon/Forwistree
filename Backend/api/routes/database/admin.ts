import express from "express";
import eventRouter from "./admin/event";

const router = express.Router();

router.use('/event', eventRouter);

export default router;