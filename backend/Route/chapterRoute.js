import { Router } from "express";
import { createChapter } from "../Controller/chapterController.js";

const router = Router();

router.post('/create-chapter', createChapter);

export default router;
