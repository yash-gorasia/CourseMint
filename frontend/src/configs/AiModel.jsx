import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  COURSE_OUTPUT_SCHEMA, 
  CHAPTER_CONTENT_SCHEMA, 
  FIX_JSON_PROMPT 
} from './PromptTemplates.jsx';

// Validate JSON against schema
const validateAgainstSchema = (data, schema) => {
  try {
    // Basic type checking
    if (schema.type === 'object' && typeof data !== 'object') return false;
    if (schema.type === 'array' && !Array.isArray(data)) return false;
    
    // Check required fields for objects
    if (schema.required && typeof data === 'object') {
      for (const field of schema.required) {
        if (!(field in data)) return false;
      }
    }
    
    // Check array items
    if (schema.type === 'array' && schema.items) {
      return data.every(item => validateAgainstSchema(item, schema.items));
    }
    
    // Check object properties
    if (schema.properties && typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (schema.properties[key]) {
          if (!validateAgainstSchema(value, schema.properties[key])) return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Schema validation error:', error);
    return false;
  }
};

// Extract JSON from text (handles markdown code blocks)
const extractJSON = (text) => {
  try {
    // Remove markdown code blocks
    const cleanText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^[^{[]*/, '') // Remove text before JSON
      .replace(/[^}\]]*$/, '') // Remove text after JSON
      .trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    // Try to find JSON within the text
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        throw new Error(`Failed to parse extracted JSON: ${parseError.message}`);
      }
    }
    throw new Error(`No valid JSON found in response: ${error.message}`);
  }
};

// Normalize data structure to expected format
const normalizeData = (data, type = 'course') => {
  if (type === 'course') {
    return {
      courseName: data.courseName || data.course_name || data.name || 'Untitled Course',
      courseDescription: data.courseDescription || data.course_description || data.description || '',
      chapters: (data.chapters || []).map(chapter => ({
        chapterName: chapter.chapterName || chapter.chapter_name || chapter.name || 'Untitled Chapter',
        chapterDescription: chapter.chapterDescription || chapter.chapter_description || chapter.description || '',
        duration: chapter.duration || '30 mins'
      }))
    };
  }
  
  if (type === 'chapter') {
    if (!Array.isArray(data)) {
      console.warn('Chapter data is not an array, converting...', data);
      // If it's an object with topics property
      if (data.topics && Array.isArray(data.topics)) {
        data = data.topics;
      } else {
        // Wrap single object in array
        data = [data];
      }
    }
    
    return data.map(topic => ({
      title: topic.title || topic.name || 'Untitled Topic',
      description: topic.description || topic.desc || '',
      codeExample: topic.codeExample || topic.code_example || topic.code || null,
      subFeatures: (topic.subFeatures || topic.sub_features || topic.subFeartures || []).map(sub => ({
        title: sub.title || sub.name || 'Untitled Sub-topic',
        description: sub.description || sub.desc || '',
        codeExample: sub.codeExample || sub.code_example || sub.code || null
      }))
    }));
  }
  
  return data;
};

export const generate_AI = async (prompt, expectedType = 'course', maxRetries = 3) => {
  const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = ai.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3, // Lower temperature for more consistent output
      topK: 1,
      topP: 0.8,
    }
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`AI Generation Attempt ${attempt}/${maxRetries}`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Raw AI Response:", text);
      
      // Extract and parse JSON
      const parsedData = extractJSON(text);
      console.log("Parsed JSON:", parsedData);
      
      // Validate against schema
      const schema = expectedType === 'course' ? COURSE_OUTPUT_SCHEMA : CHAPTER_CONTENT_SCHEMA;
      const isValid = validateAgainstSchema(parsedData, schema);
      
      if (!isValid && attempt < maxRetries) {
        console.warn(`Validation failed on attempt ${attempt}, retrying...`);
        // Try to fix the JSON with AI
        const fixPrompt = FIX_JSON_PROMPT(JSON.stringify(parsedData, null, 2), schema);
        prompt = fixPrompt; // Use fix prompt for next attempt
        continue;
      }
      
      // Normalize the data structure
      const normalizedData = normalizeData(parsedData, expectedType);
      console.log("Normalized Data:", normalizedData);
      
      return normalizedData;
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        // Return fallback data structure
        console.error('All attempts failed, returning fallback data');
        
        if (expectedType === 'course') {
          return {
            courseName: 'Generated Course',
            courseDescription: 'Course description generated by AI',
            chapters: [
              {
                chapterName: 'Introduction',
                chapterDescription: 'Introduction to the course topic',
                duration: '30 mins'
              }
            ]
          };
        } else {
          return [
            {
              title: 'Introduction Topic',
              description: 'This topic provides an introduction to the chapter content.',
              codeExample: null,
              subFeatures: []
            }
          ];
        }
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
