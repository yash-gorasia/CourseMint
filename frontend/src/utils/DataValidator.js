// Simple Data Validator - Clean and focused
export class DataValidator {
  constructor(data) {
    this.data = data;
  }

  // Clean AI response with simple fallback strategies
  static cleanAIResponse(response) {
    try {
      if (typeof response === 'object' && response !== null) return response;
      
      const text = String(response).replace(/```json\n?|\n?```/g, '').trim();
      console.log('Raw AI response length:', text.length);
      console.log('Raw AI response preview:', text.substring(0, 200) + '...');
      
      try {
        return JSON.parse(text);
      } catch (error) {
        console.warn('JSON parse failed, trying to salvage data...', error.message);
        
        // Try truncating to last complete brace/bracket
        const lastBrace = text.lastIndexOf('}');
        const lastBracket = text.lastIndexOf(']');
        const cutPoint = Math.max(lastBrace, lastBracket);
        
        if (cutPoint > 10) {
          const fixed = text.substring(0, cutPoint + 1);
          try {
            console.log('Successfully salvaged JSON by truncating');
            return JSON.parse(fixed);
          } catch (fixError) {
            console.warn('Truncation strategy failed');
          }
        }
        
        // Extract complete JSON object with proper brace counting
        const firstBrace = text.indexOf('{');
        if (firstBrace !== -1) {
          let braceCount = 0;
          let endIndex = firstBrace;
          
          for (let i = firstBrace; i < text.length; i++) {
            if (text[i] === '{') braceCount++;
            if (text[i] === '}') braceCount--;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
          
          if (braceCount === 0) {
            const completeJson = text.substring(firstBrace, endIndex + 1);
            try {
              console.log('Successfully extracted complete JSON object');
              return JSON.parse(completeJson);
            } catch (e) {
              console.warn('Complete JSON extraction failed');
            }
          }
        }
        
        console.warn('All recovery strategies failed, returning empty array');
        return [];
      }
    } catch (error) {
      console.error('Complete failure parsing AI response:', error);
      return [];
    }
  }

  // Simple utilities
  static cleanText(text) {
    return text && typeof text === 'string' ? text.trim().replace(/\s+/g, ' ') : '';
  }

  static getField(obj, ...fields) {
    if (!obj) return '';
    for (const field of fields) {
      if (obj[field]) return this.cleanText(obj[field]);
    }
    return '';
  }

  static getArray(obj, ...fields) {
    if (!obj) return [];
    for (const field of fields) {
      if (Array.isArray(obj[field])) return obj[field].filter(Boolean);
    }
    return [];
  }

  // Quiz validation with array handling
  static validateQuiz(data) {
    // Handle direct array of questions
    if (Array.isArray(data) && data.length > 0 && data[0]?.question) {
      console.log('Converting questions array to quiz object');
      data = {
        title: 'Course Assessment Quiz',
        description: 'Comprehensive quiz covering key concepts',
        questions: data
      };
    }

    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: ['Invalid quiz data'] };
    }

    const errors = [];
    if (!data.title) errors.push('Quiz title required');
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      errors.push('Quiz must have questions');
    }

    // Validate questions
    const validQuestions = [];
    if (data.questions) {
      data.questions.forEach((q, i) => {
        if (q.question && Array.isArray(q.options) && q.options.length === 4 && 
            typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3) {
          validQuestions.push({
            question: this.cleanText(q.question),
            options: q.options.map(opt => this.cleanText(opt)),
            correctAnswer: q.correctAnswer,
            explanation: this.cleanText(q.explanation || ''),
            difficulty: q.difficulty || 'medium',
            chapter: this.cleanText(q.chapter || '')
          });
        }
      });
    }

    return {
      isValid: validQuestions.length > 0,
      errors: validQuestions.length === 0 ? ['No valid questions found'] : [],
      data: {
        title: this.cleanText(data.title || 'Course Quiz'),
        description: this.cleanText(data.description || 'Course assessment'),
        questions: validQuestions
      }
    };
  }

  // Content validation
  static validateChapterContent(data) {
    const items = Array.isArray(data) ? data : [data];
    const normalized = items.filter(Boolean).map(item => ({
      title: this.getField(item, 'title', 'name'),
      description: this.getField(item, 'description', 'desc'),
      ...item
    }));

    return {
      isValid: normalized.length > 0,
      errors: normalized.length > 0 ? [] : ['No valid content found'],
      normalized
    };
  }

  // Content normalization - works for any category
  static normalizeContent(data, category = 'general') {
    if (!data) return [];
    
    // Convert to array if needed
    let items = Array.isArray(data) ? data : [data];
    if (data.topics) items = Array.isArray(data.topics) ? data.topics : [data.topics];
    
    return items.filter(Boolean).map(item => ({
      title: this.getField(item, 'title', 'name'),
      description: this.getField(item, 'description', 'desc'),
      // Include everything else as-is for flexibility
      ...item,
      // Clean sub-items if they exist
      subFeatures: this.getArray(item, 'subFeatures', 'sub_features').slice(0, 5),
      symptoms: category === 'health' ? this.getArray(item, 'symptoms') : undefined,
      codeExample: category === 'programming' ? this.getField(item, 'codeExample', 'code') : undefined
    }));
  }

  // Course normalization  
  static normalizeCourse(data) {
    if (!data) return null;
    return {
      courseName: this.getField(data, 'courseName', 'course_name') || 'Untitled Course',
      courseDescription: this.getField(data, 'courseDescription', 'course_description'),
      chapters: this.getArray(data, 'chapters')
    };
  }

  // Chapter normalization
  static normalizeChapter(data) {
    if (!data) return null;
    return {
      chapterName: this.getField(data, 'chapterName', 'chapter_name', 'name') || 'Untitled Chapter',
      chapterDescription: this.getField(data, 'chapterDescription', 'chapter_description', 'description'),
      duration: this.getField(data, 'duration') || '30 mins'
    };
  }

  // Flashcard validation
  static validateFlashcardContent(data) {
    // Handle direct array of flashcards
    if (Array.isArray(data) && data.length > 0 && data[0]?.front) {
      data = {
        title: 'Course Flashcards',
        description: 'Study flashcards for this course',
        flashcards: data
      };
    }

    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: ['Invalid flashcard data'] };
    }

    const flashcards = this.getArray(data, 'flashcards').map(card => ({
      front: this.cleanText(card.front || ''),
      back: this.cleanText(card.back || ''),
      difficulty: card.difficulty || 'medium',
      category: this.cleanText(card.category || 'general'),
      tags: Array.isArray(card.tags) ? card.tags.slice(0, 5) : [],
      chapter: this.cleanText(card.chapter || '')
    })).filter(card => card.front && card.back);

    // Check if we got the expected number of flashcards
    const errors = [];
    if (flashcards.length === 0) {
      errors.push('No valid flashcards found');
    } else if (flashcards.length < 30) {
      console.warn(`Expected 30 flashcards but got ${flashcards.length}. This may be due to AI token limits.`);
      errors.push(`Expected 30 flashcards but received ${flashcards.length}`);
    }

    return {
      isValid: flashcards.length > 0,
      errors,
      normalized: {
        title: this.cleanText(data.title || 'Course Flashcards'),
        description: this.cleanText(data.description || 'Study flashcards'),
        flashcards
      }
    };
  }

  // Course validation
  static validateCourseOutput(data) {
    const normalized = this.normalizeCourse(data);
    return {
      isValid: !!normalized && !!normalized.courseName,
      errors: normalized && normalized.courseName ? [] : ['Invalid course data'],
      normalized
    };
  }

  // Instance methods for backward compatibility
  validateFlashcardContent() {
    return DataValidator.validateFlashcardContent(this.data);
  }
}

// Backward compatibility exports
export const validateQuizContent = (data) => {
  const result = DataValidator.validateQuiz(data);
  return {
    isValid: result.isValid,
    errors: result.errors,
    warnings: [],
    normalized: result.data
  };
};

export const validateChapterContent = (data) => DataValidator.validateChapterContent(data);

export const safeDataAccess = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch (error) {
    return defaultValue;
  }
};
