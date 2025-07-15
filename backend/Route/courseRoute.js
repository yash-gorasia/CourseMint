import { Router } from "express";
import { createCourse, getCourse, getCourseByUserEmail, deleteCourse } from "../Controller/courseController.js";

const router = Router();

router.post('/create-course', createCourse);
router.get('/get-course/:id', getCourse);
router.post('/get-course-email', getCourseByUserEmail);
router.delete('/delete-course', deleteCourse);

export default router;