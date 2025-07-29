import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataValidator } from '../utils/DataValidator.js';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Main AI generation function that the pages expect
export const generate_AI = async (prompt, type = 'course') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { 
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean and parse response
    const data = DataValidator.cleanAIResponse(response);
    if (!data) {
      throw new Error('Failed to parse AI response as JSON');
    }
    
    // Normalize data based on type
    if (type === 'course') {
      return DataValidator.normalizeCourse(data);
    } else if (type === 'chapter') {
      return DataValidator.normalizeContent(data);
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
