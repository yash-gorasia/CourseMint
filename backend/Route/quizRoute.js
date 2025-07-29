import express from 'express';
import {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  updateQuiz,
  deleteQuiz
} from '../Controller/quizController.js';

const router = express.Router();

// Create a new quiz
router.post('/', createQuiz);

// Get all quizzes for a specific course
router.get('/course/:courseId', getQuizzesByCourse);

// Get a specific quiz by ID
router.get('/:quizId', getQuizById);

// Update a quiz
router.put('/:quizId', updateQuiz);

// Delete a quiz
router.delete('/:quizId', deleteQuiz);

export default router;
