// Strict JSON schemas for AI output validation
export const COURSE_OUTPUT_SCHEMA = {
  type: "object",
  required: ["courseName", "courseDescription", "chapters"],
  properties: {
    courseName: {
      type: "string",
      minLength: 1,
      maxLength: 100
    },
    courseDescription: {
      type: "string",
      minLength: 10,
      maxLength: 500
    },
    chapters: {
      type: "array",
      minItems: 1,
      maxItems: 20,
      items: {
        type: "object",
        required: ["chapterName", "chapterDescription", "duration"],
        properties: {
          chapterName: {
            type: "string",
            minLength: 1,
            maxLength: 100
          },
          chapterDescription: {
            type: "string",
            minLength: 10,
            maxLength: 300
          },
          duration: {
            type: "string",
            pattern: "^\\d+\\s+(min|mins|minutes|hour|hours|hr|hrs)$"
          }
        }
      }
    }
  }
};

export const CHAPTER_CONTENT_SCHEMA = {
  type: "array",
  minItems: 1,
  maxItems: 10,
  items: {
    type: "object",
    required: ["title", "description"],
    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 100
      },
      description: {
        type: "string",
        minLength: 20,
        maxLength: 1000
      },
      codeExample: {
        type: "string",
        minLength: 1,
        maxLength: 2000
      },
      subFeatures: {
        type: "array",
        maxItems: 5,
        items: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 100
            },
            description: {
              type: "string",
              minLength: 10,
              maxLength: 500
            },
            codeExample: {
              type: "string",
              maxLength: 1000
            }
          }
        }
      }
    }
  }
};

// Helper function to calculate average chapter duration
const calculateAverageChapterDuration = (totalDuration, numberOfChapters) => {
  if (!totalDuration || !numberOfChapters) return "30 mins";
  
  // Parse total duration
  const durationMatch = totalDuration.match(/(\d+)\s*(min|mins|minutes|hour|hours|hr|hrs)/i);
  if (!durationMatch) return "30 mins";
  
  const [, amount, unit] = durationMatch;
  const totalMinutes = unit.toLowerCase().includes('hour') || unit.toLowerCase().includes('hr') 
    ? parseInt(amount) * 60 
    : parseInt(amount);
  
  const avgMinutes = Math.round(totalMinutes / numberOfChapters);
  
  if (avgMinutes >= 60) {
    const hours = Math.round(avgMinutes / 60 * 10) / 10; // Round to 1 decimal
    return hours === 1 ? "1 hour" : `${hours} hours`;
  } else {
    return `${avgMinutes} mins`;
  }
};

// Strict prompts for course generation
export const GENERATE_COURSE_PROMPT = (category, topic, level, includeVideo, options = {}) => `
You are a course curriculum generator. You MUST respond with ONLY a valid JSON object that matches this EXACT schema. Do not include any markdown, explanations, or text outside the JSON.

STRICT REQUIREMENTS:
1. Response must be valid JSON that can be parsed with JSON.parse()
2. Field names must be EXACTLY as specified (case-sensitive)
3. All required fields must be present
4. String lengths must be within specified limits
5. Duration format must follow the pattern exactly
6. Create EXACTLY ${options.numberOfChapters || 6} chapters
7. Each chapter duration should align with total course duration of ${options.courseDuration || '6 hours'}
8. Difficulty level should be ${level}

Required JSON Schema:
{
  "courseName": "string (1-100 chars)",
  "courseDescription": "string (10-500 chars)", 
  "chapters": [
    {
      "chapterName": "string (1-100 chars)",
      "chapterDescription": "string (10-300 chars)",
      "duration": "string (format: '10 mins' or '1 hour')"
    }
  ]
}

COURSE SPECIFICATIONS:
- Topic: "${topic}"
- Category: "${category}"
- Difficulty Level: "${level}"
- Total Course Duration: "${options.courseDuration || '6 hours'}"
- Number of Chapters: ${options.numberOfChapters || 6}
- Include Video Content: ${includeVideo ? 'Yes' : 'No'}

CHAPTER DURATION GUIDELINES:
${options.courseDuration && options.numberOfChapters ? `
- Total duration: ${options.courseDuration}
- Number of chapters: ${options.numberOfChapters}
- Average chapter duration: ${calculateAverageChapterDuration(options.courseDuration, options.numberOfChapters)}
- Distribute duration logically across chapters
` : `
- Use appropriate durations: "15 mins", "30 mins", "45 mins", "1 hour", "1.5 hours", "2 hours"
- Progressive difficulty: start with shorter chapters, increase for complex topics
`}

CONTENT GUIDELINES:
- ${level === 'beginner' ? 'Start with fundamental concepts, use simple language, include many examples' : 
    level === 'intermediate' ? 'Assume basic knowledge, focus on practical applications and deeper concepts' : 
    'Cover advanced topics, assume strong foundation, include complex scenarios and best practices'}
- ${includeVideo ? 'Include video learning recommendations in chapter descriptions' : 'Focus on text-based learning with practical exercises'}
- Ensure logical progression from chapter to chapter
- Each chapter should build upon previous knowledge

Return ONLY the JSON object:
`;

export const GENERATE_CHAPTER_CONTENT_PROMPT = (chapterName, chapterDescription, courseCategory, level = 'intermediate') => `
You are a chapter content generator. You MUST respond with ONLY a valid JSON array that matches this EXACT schema. Do not include any markdown, explanations, or text outside the JSON.

STRICT REQUIREMENTS:
1. Response must be a valid JSON array that can be parsed with JSON.parse()
2. Field names must be EXACTLY as specified (case-sensitive)
3. All required fields must be present
4. Include 3-6 main topics per chapter based on difficulty level
5. MANDATORY: Include code examples for at least 80% of topics and 60% of subFeatures
6. Code examples should be practical, runnable, and well-commented

Required JSON Schema (Array of Topics):
[
  {
    "title": "string (1-100 chars)",
    "description": "string (20-1000 chars)",
    "codeExample": "string (HIGHLY RECOMMENDED, 1-2000 chars)",
    "subFeatures": [
      {
        "title": "string (1-100 chars)",
        "description": "string (10-500 chars)",
        "codeExample": "string (RECOMMENDED, max 1000 chars)"
      }
    ]
  }
]

CHAPTER SPECIFICATIONS:
- Chapter: "${chapterName}"
- Context: "${chapterDescription}"
- Course Category: "${courseCategory}"
- Difficulty Level: "${level}"

CONTENT GUIDELINES FOR ${level.toUpperCase()} LEVEL:
${level.toLowerCase() === 'beginner' ? `
- Use simple, clear language and explain fundamental concepts
- Include basic examples and step-by-step explanations
- Provide more context and background information
- Focus on practical, hands-on learning
- Include 3-4 main topics with detailed subFeatures
- MUST include code examples for basic concepts
` : level.toLowerCase() === 'intermediate' ? `
- Assume basic knowledge and focus on practical applications
- Include real-world examples and use cases
- Balance theory with hands-on practice
- Cover common pitfalls and best practices
- Include 4-5 main topics with relevant subFeatures
- MUST include practical code examples and implementations
` : `
- Assume strong foundation and cover advanced concepts
- Include complex scenarios and edge cases
- Focus on optimization, performance, and best practices
- Discuss advanced patterns and architectural considerations
- Include 5-6 main topics with in-depth subFeatures
- MUST include advanced code examples with optimizations
`}

CODE EXAMPLE REQUIREMENTS:
- MANDATORY for programming-related topics
- All code should be syntactically correct and runnable
- Include meaningful comments explaining key concepts
- Show progressive complexity within the chapter
- Use realistic variable names and scenarios
- For ${courseCategory}: Follow industry-standard practices and conventions

CODE EXAMPLE FORMATTING:
- Use clean, readable formatting
- Include line breaks and proper indentation
- Add comments to explain complex logic
- Show complete, working examples when possible
- For web development: Include HTML, CSS, or JavaScript as appropriate
- For programming: Include imports, function definitions, and usage examples

STRUCTURE GUIDELINES:
- Each topic should build upon the previous one
- SubFeatures should break down complex topics into digestible parts
- Ensure logical progression throughout the chapter
- Include practical applications and real-world connections
- Balance explanation with hands-on code examples

EXAMPLES OF GOOD CODE EXAMPLES:
- Functions with input/output examples
- Class definitions with usage
- API calls with error handling
- Database queries with sample data
- HTML/CSS with interactive elements
- Configuration files with explanations

Return ONLY the JSON array:
`;

// Validation prompts for fixing malformed responses
export const FIX_JSON_PROMPT = (malformedJson, expectedSchema) => `
The following JSON is malformed or doesn't match the required schema. Fix it to match the EXACT schema provided.

Malformed JSON:
${malformedJson}

Required Schema:
${JSON.stringify(expectedSchema, null, 2)}

STRICT REQUIREMENTS:
1. Fix any JSON syntax errors
2. Ensure all required fields are present
3. Match field names exactly (case-sensitive)
4. Ensure data types match the schema
5. Keep content meaningful and educational

Return ONLY the corrected JSON:
`;
