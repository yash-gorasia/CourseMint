// Simple prompt templates for AI generation

// Generate course structure
export const createCoursePrompt = (category, topic, level, duration, chapters) => `
Create a ${level} level course about "${topic}" in the ${category} category.

STRICT REQUIREMENTS:
- Course duration: ${duration}
- Number of chapters: EXACTLY ${chapters} chapters (no more, no less)
- Must generate exactly ${chapters} chapters in the JSON response
- Respond with ONLY valid JSON

JSON format (must contain exactly ${chapters} chapters):
{
  "courseName": "Course title here",
  "courseDescription": "Brief description (50-200 words)",
  "chapters": [
    {
      "chapterName": "Chapter title",
      "chapterDescription": "Chapter description (20-100 words)", 
      "duration": "15 mins"
    }
  ]
}

IMPORTANT: The chapters array must contain exactly ${chapters} chapters. Do not include more or fewer chapters.
`;

// Generate chapter content
export const createChapterContentPrompt = (chapterName, topic, level, chapterDescription = '') => `
Create detailed content for the chapter "${chapterName}" about ${topic} for ${level} level students.

Chapter context: ${chapterDescription}

Include:
- 4-6 main topics with descriptions  
- Code examples where relevant (80% of topics should have code)
- Sub-topics for complex concepts

Respond with ONLY valid JSON:
[
  {
    "title": "Topic title",
    "description": "Detailed explanation (100-500 words)",
    "codeExample": "practical code example or null",
    "subFeatures": [
      {
        "title": "Sub-topic title", 
        "description": "Sub-topic explanation (50-200 words)",
        "codeExample": "code snippet or null"
      }
    ]
  }
]

Guidelines for ${level} level:
${getContentGuidelines(level)}
`;

// Content guidelines helper
const getContentGuidelines = (level) => {
  switch (level.toLowerCase()) {
    case 'beginner':
      return '- Use simple, clear language\n- Explain fundamental concepts\n- Include step-by-step examples\n- Focus on practical applications';
    case 'intermediate': 
      return '- Assume basic knowledge\n- Introduce advanced concepts\n- Show real-world use cases\n- Include optimization tips';
    case 'advanced':
      return '- Use technical terminology\n- Cover complex scenarios\n- Include performance considerations\n- Show industry best practices';
    default:
      return '- Adapt content to audience level\n- Provide clear explanations\n- Include practical examples';
  }
};

// Legacy support - these are the functions the pages expect
export const GENERATE_COURSE_PROMPT = (category, topic, level, includeVideo, dynamicOptions = {}) => 
  createCoursePrompt(category, topic, level, dynamicOptions.courseDuration || '2 Hours', dynamicOptions.numberOfChapters || 6);

export const GENERATE_CHAPTER_CONTENT_PROMPT = (chapterName, chapterDescription, courseContext, level) =>
  createChapterContentPrompt(chapterName, courseContext.topic || 'programming', level, chapterDescription);
