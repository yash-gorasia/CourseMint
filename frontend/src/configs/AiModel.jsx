import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataValidator } from '../utils/DataValidator.js';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Main AI generation function that the pages expect
export const generate_AI = async (prompt, type = 'course', category = 'general') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { 
        temperature: 0.3,
        maxOutputTokens: 8192
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean and parse response
    const data = DataValidator.cleanAIResponse(response);
    
    // Only throw error if we get null/undefined - empty array might be valid
    if (data === null || data === undefined) {
      throw new Error('Failed to parse AI response as JSON');
    }
    
    // For empty arrays, log warning but continue
    if (Array.isArray(data) && data.length === 0) {
      console.warn('AI returned empty array, this might indicate incomplete response');
    }
    
    // Normalize data based on type
    if (type === 'course') {
      return DataValidator.normalizeCourse(data);
    } else if (type === 'chapter') {
      return DataValidator.normalizeContent(data, category);
    } else if (type === 'quiz') {
      // For quiz, return the raw parsed data so validateQuizContent can handle it
      return data;
    }
    
    return data;
  } catch (error) {
    console.error('AI generation failed:', error);
    throw error;
  }
};

// Legacy support functions
export const generateCourseWithAI = generate_AI;
export const generateChapterContentWithAI = (prompt) => generate_AI(prompt, 'chapter');
export const generateCourseOutlineWithAI = generate_AI;
export const generateDetailedChapterContentWithAI = (prompt) => generate_AI(prompt, 'chapter');
