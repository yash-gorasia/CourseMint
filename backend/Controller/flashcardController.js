import FlashcardSet from '../Model/flashcardModel.js';
import CourseList from '../Model/courseListModel.js';

// Create flashcard set for a course
const createFlashcardSet = async (req, res) => {
  try {
    console.log('Received flashcard creation request:', req.body);
    const { courseId, title, description, flashcards, category, level } = req.body;

    // Validate required fields
    if (!courseId) {
      console.log('Missing courseId');
      return res.status(400).json({ 
        success: false, 
        message: 'courseId is required' 
      });
    }

    // Check if course exists
    console.log('Checking if course exists:', courseId);
    const course = await CourseList.findById(courseId);
    if (!course) {
      console.log('Course not found:', courseId);
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if flashcard set already exists for this course
    console.log('Checking for existing flashcard set for course:', courseId);
    const existingSet = await FlashcardSet.findOne({ courseId });
    if (existingSet) {
      console.log('Flashcard set already exists for course:', courseId);
      return res.status(400).json({ 
        success: false, 
        message: 'Flashcard set already exists for this course' 
      });
    }

    console.log('Creating new flashcard set with data:', {
      courseId,
      title,
      description,
      flashcardsCount: flashcards?.length || 0,
      category,
      level
    });

    const flashcardSet = new FlashcardSet({
      courseId,
      title,
      description,
      flashcards: flashcards || [],
      category,
      level
    });

    console.log('Saving flashcard set...');
    const savedSet = await flashcardSet.save();
    console.log('Flashcard set saved successfully:', savedSet._id);
    
    res.status(201).json({
      success: true,
      message: 'Flashcard set created successfully',
      flashcardSet: savedSet
    });
  } catch (error) {
    console.error('Error creating flashcard set:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get flashcard sets by course ID
const getFlashcardSetsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const flashcardSets = await FlashcardSet.find({ courseId })
      .populate('courseId', 'courseName courseDescription category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      flashcardSets
    });
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get specific flashcard set by ID
const getFlashcardSetById = async (req, res) => {
  try {
    const { setId } = req.params;

    const flashcardSet = await FlashcardSet.findById(setId)
      .populate('courseId', 'courseName courseDescription category');

    if (!flashcardSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flashcard set not found' 
      });
    }

    res.status(200).json({
      success: true,
      flashcardSet
    });
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update flashcard set
const updateFlashcardSet = async (req, res) => {
  try {
    const { setId } = req.params;
    const { title, description, flashcards, level } = req.body;

    const flashcardSet = await FlashcardSet.findByIdAndUpdate(
      setId,
      {
        title,
        description,
        flashcards,
        level,
        totalCards: flashcards ? flashcards.length : undefined
      },
      { new: true, runValidators: true }
    );

    if (!flashcardSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flashcard set not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flashcard set updated successfully',
      flashcardSet
    });
  } catch (error) {
    console.error('Error updating flashcard set:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete flashcard set
const deleteFlashcardSet = async (req, res) => {
  try {
    const { setId } = req.params;

    const flashcardSet = await FlashcardSet.findByIdAndDelete(setId);

    if (!flashcardSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flashcard set not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flashcard set deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting flashcard set:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Add individual flashcard to set
const addFlashcard = async (req, res) => {
  try {
    const { setId } = req.params;
    const { front, back, category, difficulty, tags } = req.body;

    const flashcardSet = await FlashcardSet.findById(setId);
    if (!flashcardSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flashcard set not found' 
      });
    }

    flashcardSet.flashcards.push({
      front,
      back,
      category,
      difficulty,
      tags
    });

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      message: 'Flashcard added successfully',
      flashcardSet
    });
  } catch (error) {
    console.error('Error adding flashcard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Remove flashcard from set
const removeFlashcard = async (req, res) => {
  try {
    const { setId, cardId } = req.params;

    const flashcardSet = await FlashcardSet.findById(setId);
    if (!flashcardSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flashcard set not found' 
      });
    }

    flashcardSet.flashcards.id(cardId).remove();
    await flashcardSet.save();

    res.status(200).json({
      success: true,
      message: 'Flashcard removed successfully',
      flashcardSet
    });
  } catch (error) {
    console.error('Error removing flashcard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export {
  createFlashcardSet,
  getFlashcardSetsByCourse,
  getFlashcardSetById,
  updateFlashcardSet,
  deleteFlashcardSet,
  addFlashcard,
  removeFlashcard
};
