// Data validation and normalization utilities
export class DataValidator {
  static validateCourseOutput(courseOutput) {
    const errors = [];
    
    if (!courseOutput || typeof courseOutput !== 'object') {
      errors.push('Course output must be an object');
      return { isValid: false, errors, normalized: null };
    }
    
    const normalized = {
      courseName: this.sanitizeString(courseOutput.courseName || courseOutput.course_name || ''),
      courseDescription: this.sanitizeString(courseOutput.courseDescription || courseOutput.course_description || ''),
      chapters: []
    };
    
    if (!normalized.courseName) {
      errors.push('Course name is required');
    }
    
    if (normalized.courseName.length > 100) {
      errors.push('Course name must be less than 100 characters');
    }
    
    if (normalized.courseDescription.length > 500) {
      errors.push('Course description must be less than 500 characters');
    }
    
    // Validate chapters
    const chapters = courseOutput.chapters || [];
    if (!Array.isArray(chapters)) {
      errors.push('Chapters must be an array');
    } else {
      normalized.chapters = chapters.map((chapter, index) => {
        const chapterResult = this.validateChapterBasicInfo(chapter, index);
        if (!chapterResult.isValid) {
          errors.push(...chapterResult.errors);
        }
        return chapterResult.normalized;
      }).filter(Boolean);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      normalized
    };
  }
  
  static validateChapterBasicInfo(chapter, index = 0) {
    const errors = [];
    
    if (!chapter || typeof chapter !== 'object') {
      errors.push(`Chapter ${index + 1} must be an object`);
      return { isValid: false, errors, normalized: null };
    }
    
    const normalized = {
      chapterName: this.sanitizeString(chapter.chapterName || chapter.chapter_name || ''),
      chapterDescription: this.sanitizeString(chapter.chapterDescription || chapter.chapter_description || chapter.description || ''),
      duration: this.normalizeDuration(chapter.duration || '30 mins')
    };
    
    if (!normalized.chapterName) {
      errors.push(`Chapter ${index + 1} name is required`);
    }
    
    if (normalized.chapterName.length > 100) {
      errors.push(`Chapter ${index + 1} name must be less than 100 characters`);
    }
    
    if (normalized.chapterDescription.length > 300) {
      errors.push(`Chapter ${index + 1} description must be less than 300 characters`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      normalized
    };
  }
  
  static validateChapterContent(content) {
    const errors = [];
    
    if (!content) {
      return {
        isValid: false,
        errors: ['Chapter content is required'],
        normalized: []
      };
    }
    
    let normalized = [];
    
    // Handle different content structures
    if (Array.isArray(content)) {
      normalized = content;
    } else if (content.topics && Array.isArray(content.topics)) {
      normalized = content.topics;
    } else if (typeof content === 'object') {
      normalized = [content];
    } else {
      errors.push('Invalid content structure');
      return { isValid: false, errors, normalized: [] };
    }
    
    // Validate and normalize each topic
    normalized = normalized.map((topic, index) => {
      const topicResult = this.validateTopic(topic, index);
      if (!topicResult.isValid) {
        errors.push(...topicResult.errors);
      }
      return topicResult.normalized;
    }).filter(Boolean);
    
    return {
      isValid: errors.length === 0,
      errors,
      normalized
    };
  }
  
  static validateTopic(topic, index = 0) {
    const errors = [];
    
    if (!topic || typeof topic !== 'object') {
      errors.push(`Topic ${index + 1} must be an object`);
      return { isValid: false, errors, normalized: null };
    }
    
    const normalized = {
      title: this.sanitizeString(topic.title || topic.name || ''),
      description: this.sanitizeString(topic.description || topic.desc || ''),
      codeExample: this.sanitizeCode(topic.codeExample || topic.code_example || topic.code || null),
      subFeatures: []
    };
    
    if (!normalized.title) {
      errors.push(`Topic ${index + 1} title is required`);
    }
    
    if (normalized.title.length > 100) {
      errors.push(`Topic ${index + 1} title must be less than 100 characters`);
    }
    
    if (!normalized.description) {
      errors.push(`Topic ${index + 1} description is required`);
    }
    
    if (normalized.description.length < 20) {
      errors.push(`Topic ${index + 1} description must be at least 20 characters`);
    }
    
    if (normalized.description.length > 1000) {
      errors.push(`Topic ${index + 1} description must be less than 1000 characters`);
    }
    
    // Encourage code examples for programming topics
    if (!normalized.codeExample) {
      console.warn(`Topic ${index + 1} (${normalized.title}) is missing a code example - consider adding one for better learning experience`);
    }
    
    // Validate subFeatures
    const subFeatures = topic.subFeatures || topic.sub_features || topic.subFeartures || [];
    if (Array.isArray(subFeatures)) {
      normalized.subFeatures = subFeatures.map((sub, subIndex) => {
        const subResult = this.validateSubFeature(sub, index, subIndex);
        if (!subResult.isValid) {
          errors.push(...subResult.errors);
        }
        return subResult.normalized;
      }).filter(Boolean);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      normalized
    };
  }
  
  static validateSubFeature(subFeature, topicIndex = 0, subIndex = 0) {
    const errors = [];
    
    if (!subFeature || typeof subFeature !== 'object') {
      errors.push(`Topic ${topicIndex + 1} sub-feature ${subIndex + 1} must be an object`);
      return { isValid: false, errors, normalized: null };
    }
    
    const normalized = {
      title: this.sanitizeString(subFeature.title || subFeature.name || ''),
      description: this.sanitizeString(subFeature.description || subFeature.desc || ''),
      codeExample: this.sanitizeCode(subFeature.codeExample || subFeature.code_example || subFeature.code || null)
    };
    
    if (!normalized.title) {
      errors.push(`Topic ${topicIndex + 1} sub-feature ${subIndex + 1} title is required`);
    }
    
    if (normalized.title.length > 100) {
      errors.push(`Topic ${topicIndex + 1} sub-feature ${subIndex + 1} title must be less than 100 characters`);
    }
    
    if (!normalized.description) {
      errors.push(`Topic ${topicIndex + 1} sub-feature ${subIndex + 1} description is required`);
    }
    
    if (normalized.description.length < 10) {
      errors.push(`Topic ${topicIndex + 1} sub-feature ${subIndex + 1} description must be at least 10 characters`);
    }
    
    if (normalized.description.length > 500) {
      errors.push(`Topic ${topicIndex + 1} sub-feature ${subIndex + 1} description must be less than 500 characters`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      normalized
    };
  }
  
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/\s+/g, ' '); // Normalize whitespace
  }
  
  static sanitizeCode(code) {
    if (!code || typeof code !== 'string') return null;
    
    // Remove HTML pre tags if present
    return code
      .replace(/<pre[^>]*>/gi, '')
      .replace(/<\/pre>/gi, '')
      .trim();
  }
  
  static normalizeDuration(duration) {
    if (typeof duration !== 'string') return '30 mins';
    
    // Extract numbers and units
    const match = duration.match(/(\d+)\s*(min|mins|minutes|hour|hours|hr|hrs)/i);
    if (match) {
      const [, number, unit] = match;
      const normalizedUnit = unit.toLowerCase().includes('hour') || unit.toLowerCase().includes('hr') ? 'hour' : 'mins';
      const pluralUnit = parseInt(number) === 1 ? normalizedUnit.replace('s', '') : normalizedUnit;
      return `${number} ${pluralUnit}`;
    }
    
    return duration || '30 mins';
  }
}

// Helper function for components
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

// Hook for data validation
export const useDataValidation = () => {
  const validateAndNormalize = (data, type) => {
    try {
      switch (type) {
        case 'course':
          return DataValidator.validateCourseOutput(data);
        case 'chapter-content':
          return DataValidator.validateChapterContent(data);
        case 'chapter-basic':
          return DataValidator.validateChapterBasicInfo(data);
        default:
          return { isValid: false, errors: ['Unknown validation type'], normalized: null };
      }
    } catch (error) {
      console.error('Validation error:', error);
      return { isValid: false, errors: [error.message], normalized: null };
    }
  };
  
  return { validateAndNormalize };
};
