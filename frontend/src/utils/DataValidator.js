// Simplified Data Utilities
export class DataValidator {
  // Clean AI response and parse JSON
  static cleanAIResponse(response) {
    try {
      // Handle different response types
      let responseText = response;
      
      // If response is already an object, return it
      if (typeof response === 'object' && response !== null) {
        return response;
      }
      
      // If response is not a string, convert it
      if (typeof response !== 'string') {
        responseText = String(response);
      }
      
      // Clean markdown code blocks and parse JSON
      const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response type:', typeof response);
      console.error('Response value:', response);
      return null;
    }
  }

  // Normalize course data
  static normalizeCourse(data) {
    if (!data) return null;
    
    return {
      courseName: this.cleanText(data.courseName || data.course_name || 'Untitled Course'),
      courseDescription: this.cleanText(data.courseDescription || data.course_description || ''),
      chapters: Array.isArray(data.chapters) ? data.chapters.map(ch => this.normalizeChapter(ch)) : []
    };
  }
  // Normalize chapter data
  static normalizeChapter(data) {
    if (!data) return null;
    
    return {
      chapterName: this.cleanText(data.chapterName || data.chapter_name || data.name || 'Untitled Chapter'),
      chapterDescription: this.cleanText(data.chapterDescription || data.chapter_description || data.description || ''),
      duration: this.cleanText(data.duration || '30 mins')
    };
  }

  // Normalize chapter content
  static normalizeContent(content) {
    if (!content) return [];
    
    // Handle different content structures
    let topics = [];
    if (Array.isArray(content)) {
      topics = content;
    } else if (content.topics && Array.isArray(content.topics)) {
      topics = content.topics;
    } else if (typeof content === 'object') {
      topics = [content];
    }
    
    return topics.map(topic => this.normalizeTopic(topic)).filter(Boolean);
  }

  // Normalize single topic
  static normalizeTopic(topic) {
    if (!topic) return null;
    
    // Check if this is health content (has medical-specific fields)
    if (topic.symptoms || topic.diagnosis || topic.treatment || topic.caseStudy) {
      return this.normalizeHealthTopic(topic);
    }
    
    // Standard topic normalization for non-health content
    return {
      title: this.cleanText(topic.title || topic.name || 'Untitled Topic'),
      description: this.cleanText(topic.description || topic.desc || ''),
      codeExample: this.cleanCode(topic.codeExample || topic.code_example || topic.code),
      subFeatures: Array.isArray(topic.subFeatures || topic.sub_features || topic.subFeartures) 
        ? (topic.subFeatures || topic.sub_features || topic.subFeartures).map(sub => this.normalizeSubFeature(sub)).filter(Boolean)
        : []
    };
  }

  // Normalize health-specific topic
  static normalizeHealthTopic(topic) {
    if (!topic) return null;
    
    return {
      title: this.cleanText(topic.title || topic.name || 'Untitled Medical Topic'),
      description: this.cleanText(topic.description || topic.desc || ''),
      anatomyDescription: this.cleanText(topic.anatomyDescription || ''),
      symptoms: Array.isArray(topic.symptoms) ? topic.symptoms.map(s => this.cleanText(s)).filter(Boolean) : [],
      diagnosis: topic.diagnosis ? {
        differentialDiagnosis: Array.isArray(topic.diagnosis.differentialDiagnosis) 
          ? topic.diagnosis.differentialDiagnosis.map(d => this.cleanText(d)).filter(Boolean) : [],
        diagnosticTests: Array.isArray(topic.diagnosis.diagnosticTests) 
          ? topic.diagnosis.diagnosticTests.map(t => this.cleanText(t)).filter(Boolean) : [],
        redFlags: Array.isArray(topic.diagnosis.redFlags) 
          ? topic.diagnosis.redFlags.map(f => this.cleanText(f)).filter(Boolean) : []
      } : null,
      treatment: topic.treatment ? {
        primaryTreatment: this.cleanText(topic.treatment.primaryTreatment || ''),
        alternatives: Array.isArray(topic.treatment.alternatives) 
          ? topic.treatment.alternatives.map(a => this.cleanText(a)).filter(Boolean) : [],
        contraindications: Array.isArray(topic.treatment.contraindications) 
          ? topic.treatment.contraindications.map(c => this.cleanText(c)).filter(Boolean) : [],
        sideEffects: Array.isArray(topic.treatment.sideEffects) 
          ? topic.treatment.sideEffects.map(s => this.cleanText(s)).filter(Boolean) : []
      } : null,
      caseStudy: topic.caseStudy ? {
        patientPresentation: this.cleanText(topic.caseStudy.patientPresentation || ''),
        clinicalFindings: this.cleanText(topic.caseStudy.clinicalFindings || ''),
        investigationResults: this.cleanText(topic.caseStudy.investigationResults || ''),
        diagnosis: this.cleanText(topic.caseStudy.diagnosis || ''),
        treatmentPlan: this.cleanText(topic.caseStudy.treatmentPlan || ''),
        outcome: this.cleanText(topic.caseStudy.outcome || '')
      } : null,
      clinicalPearls: Array.isArray(topic.clinicalPearls) 
        ? topic.clinicalPearls.map(p => this.cleanText(p)).filter(Boolean) : [],
      mnemonics: topic.mnemonics ? {
        title: this.cleanText(topic.mnemonics.title || ''),
        mnemonic: this.cleanText(topic.mnemonics.mnemonic || ''),
        explanation: this.cleanText(topic.mnemonics.explanation || '')
      } : null,
      subFeatures: Array.isArray(topic.subFeatures || topic.sub_features || topic.subFeartures) 
        ? (topic.subFeatures || topic.sub_features || topic.subFeartures).map(sub => this.normalizeHealthSubFeature(sub)).filter(Boolean)
        : []
    };
  }

  // Normalize health sub-feature
  static normalizeHealthSubFeature(sub) {
    if (!sub) return null;
    
    return {
      title: this.cleanText(sub.title || sub.name || 'Untitled Sub-topic'),
      description: this.cleanText(sub.description || sub.desc || ''),
      clinicalSignificance: this.cleanText(sub.clinicalSignificance || ''),
      practicalTips: Array.isArray(sub.practicalTips) 
        ? sub.practicalTips.map(tip => this.cleanText(tip)).filter(Boolean) : []
    };
  }

  // Normalize sub-feature
  static normalizeSubFeature(sub) {
    if (!sub) return null;
    
    return {
      title: this.cleanText(sub.title || sub.name || 'Untitled Sub-topic'),
      description: this.cleanText(sub.description || sub.desc || ''),
      codeExample: this.cleanCode(sub.codeExample || sub.code_example || sub.code)
    };
  }

  // Clean text utility
  static cleanText(text) {
    if (typeof text !== 'string') return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  // Clean code utility
  static cleanCode(code) {
    if (!code || typeof code !== 'string') return null;
    return code.replace(/<pre[^>]*>|<\/pre>/gi, '').trim();
  }

  // Legacy validation methods for compatibility
  static validateCourseOutput(data) {
    const normalized = this.normalizeCourse(data);
    return {
      isValid: !!normalized,
      errors: normalized ? [] : ['Invalid course data'],
      normalized
    };
  }

  static validateChapterContent(data) {
    const normalized = this.normalizeContent(data);
    return {
      isValid: Array.isArray(normalized) && normalized.length > 0,
      errors: Array.isArray(normalized) && normalized.length > 0 ? [] : ['Invalid chapter content'],
      normalized
    };
  }
}

// Simple helper functions for components
export const getFieldValue = (obj, ...fields) => {
  for (const field of fields) {
    if (obj && obj[field]) return obj[field];
  }
  return '';
};

// Validate quiz content
export const validateQuizContent = (response) => {
  const errors = [];
  const warnings = [];
  
  // Handle already parsed data vs raw response
  let cleaned = response;
  
  // If response is a string, parse it
  if (typeof response === 'string') {
    cleaned = DataValidator.cleanAIResponse(response);
    if (!cleaned) {
      return {
        isValid: false,
        errors: ['Failed to parse quiz response as JSON'],
        warnings: [],
        normalized: null
      };
    }
  }
  
  // If response is null or undefined
  if (!cleaned || typeof cleaned !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid quiz response format'],
      warnings: [],
      normalized: null
    };
  }

  // Validate basic structure
  if (!cleaned.title || typeof cleaned.title !== 'string') {
    errors.push('Quiz title is required and must be a string');
  }

  if (!cleaned.questions || !Array.isArray(cleaned.questions)) {
    errors.push('Questions array is required');
  } else {
    // Validate questions
    cleaned.questions.forEach((question, index) => {
      if (!question.question || typeof question.question !== 'string') {
        errors.push(`Question ${index + 1}: Question text is required`);
      }
      
      if (!question.options || !Array.isArray(question.options) || question.options.length !== 4) {
        errors.push(`Question ${index + 1}: Must have exactly 4 options`);
      }
      
      if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
        errors.push(`Question ${index + 1}: Correct answer must be a number between 0-3`);
      }
    });
  }

  // Normalize the data
  const normalized = DataValidator.normalizeQuiz(cleaned);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalized
  };
};

// Normalize quiz data
DataValidator.normalizeQuiz = function(data) {
  if (!data) return null;
  
  return {
    title: this.cleanText(data.title || 'Untitled Quiz'),
    description: this.cleanText(data.description || ''),
    questions: Array.isArray(data.questions) ? data.questions.map(q => this.normalizeQuestion(q)).filter(Boolean) : [],
    timeLimit: typeof data.timeLimit === 'number' ? data.timeLimit : 30,
    passingScore: typeof data.passingScore === 'number' ? data.passingScore : 70
  };
};

// Normalize quiz question
DataValidator.normalizeQuestion = function(data) {
  if (!data) return null;
  
  return {
    question: this.cleanText(data.question || ''),
    options: Array.isArray(data.options) ? data.options.map(opt => this.cleanText(opt)).slice(0, 4) : [],
    correctAnswer: typeof data.correctAnswer === 'number' ? Math.max(0, Math.min(3, data.correctAnswer)) : 0,
    explanation: this.cleanText(data.explanation || ''),
    difficulty: ['easy', 'medium', 'hard'].includes(data.difficulty) ? data.difficulty : 'medium',
    chapter: this.cleanText(data.chapter || '')
  };
};

export const safeArray = (value) => Array.isArray(value) ? value : [];

// Legacy helper function for deep object access
export const safeDataAccess = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch (error) {
    console.warn('Safe data access failed:', error);
    return defaultValue;
  }
};
