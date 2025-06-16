import { Router } from "express";
import { createCourse } from "../Controller/courseController.js";

const router = Router();

router.post('/create-course', createCourse);

export default router;