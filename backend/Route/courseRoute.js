import { Router } from "express";
import { createCourse, getCourse } from "../Controller/courseController.js";

const router = Router();

router.post('/create-course', createCourse);
router.get('/get-course/:id', getCourse);

export default router;