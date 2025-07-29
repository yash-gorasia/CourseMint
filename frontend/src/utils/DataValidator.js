// Simplified Data Utilities
export class DataValidator {
  // Clean AI response and parse JSON
  static cleanAIResponse(response) {
    try {
      const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
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
    
    return {
      title: this.cleanText(topic.title || topic.name || 'Untitled Topic'),
      description: this.cleanText(topic.description || topic.desc || ''),
      codeExample: this.cleanCode(topic.codeExample || topic.code_example || topic.code),
      subFeatures: Array.isArray(topic.subFeatures || topic.sub_features || topic.subFeartures) 
        ? (topic.subFeatures || topic.sub_features || topic.subFeartures).map(sub => this.normalizeSubFeature(sub)).filter(Boolean)
        : []
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
