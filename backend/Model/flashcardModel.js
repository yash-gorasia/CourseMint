import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
    trim: true
  },
  back: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'concept'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

const flashcardSetSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courselists',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  flashcards: [flashcardSchema],
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  totalCards: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Update totalCards when flashcards are modified
flashcardSetSchema.pre('save', function(next) {
  this.totalCards = this.flashcards.length;
  next();
});

const FlashcardSet = mongoose.model('FlashcardSet', flashcardSetSchema);

export default FlashcardSet;
