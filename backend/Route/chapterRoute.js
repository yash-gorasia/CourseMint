import { Router } from "express";
import { createChapter, getChapterContent, getChaptersByCourseId } from "../Controller/chapterController.js";

const router = Router();

router.post('/create-chapter', createChapter);
router.get('/get-chapter/:chapterId', getChapterContent);
router.get('/get-chapters/:courseId', getChaptersByCourseId);

export default router;
