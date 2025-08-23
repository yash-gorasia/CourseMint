import express from 'express';
import {
  createFlashcardSet,
  getFlashcardSetsByCourse,
  getFlashcardSetById,
  updateFlashcardSet,
  deleteFlashcardSet,
  addFlashcard,
  removeFlashcard
} from '../Controller/flashcardController.js';

const router = express.Router();

// Create flashcard set
router.post('/create', createFlashcardSet);

// Get flashcard sets by course ID
router.get('/course/:courseId', getFlashcardSetsByCourse);

// Get specific flashcard set by ID
router.get('/:setId', getFlashcardSetById);

// Update flashcard set
router.put('/:setId', updateFlashcardSet);

// Delete flashcard set
router.delete('/:setId', deleteFlashcardSet);

// Add flashcard to set
router.post('/:setId/flashcard', addFlashcard);

// Remove flashcard from set
router.delete('/:setId/flashcard/:cardId', removeFlashcard);

export default router;
