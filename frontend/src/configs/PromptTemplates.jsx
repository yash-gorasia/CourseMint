// Simple prompt templates for AI generation

// Generate course structure for Health category
export const createHealthCoursePrompt = (topic, level, duration, chapters) => `
Create a ${level} level medical education course about "${topic}" in the Health category.

STRICT REQUIREMENTS:
- Course duration: ${duration}
- Number of chapters: EXACTLY ${chapters} chapters (no more, no less)
- Focus on medical accuracy and evidence-based content
- Include clinical relevance and practical applications
- Respond with ONLY valid JSON

JSON format (must contain exactly ${chapters} chapters):
{
  "courseName": "Medical course title with proper terminology",
  "courseDescription": "Comprehensive medical description including learning objectives, target audience (medical students/professionals), and clinical relevance (100-250 words)",
  "chapters": [
    {
      "chapterName": "Chapter title using medical terminology",
      "chapterDescription": "Chapter description focusing on pathophysiology, clinical presentation, diagnosis, and treatment (30-120 words)", 
      "duration": "20-30 mins",
      "learningObjectives": ["objective1", "objective2", "objective3"],
      "clinicalRelevance": "Why this chapter is important for medical practice"
    }
  ]
}

MEDICAL CONTENT GUIDELINES:
- Use proper medical terminology and anatomical references
- Include pathophysiology explanations
- Focus on clinical decision-making and differential diagnosis
- Emphasize evidence-based medicine principles
- Include patient safety considerations

IMPORTANT: The chapters array must contain exactly ${chapters} chapters with medical focus.
`;

// Generate course structure for non-Health categories
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

// Generate chapter content for Health category
export const createHealthChapterContentPrompt = (chapterName, topic, level, chapterDescription = '') => `
Create detailed medical content for chapter "${chapterName}" about ${topic} for ${level} level.

Chapter context: ${chapterDescription}

Make the content very elaborate and comprehensive. Include extensive medical information.

RESPOND WITH ONLY VALID JSON:
[
  {
    "title": "Main Medical Topic",
    "description": "Very detailed medical explanation with pathophysiology, etiology, epidemiology, and clinical significance. Include mechanisms, risk factors, and detailed medical background. Make this 500-1000 words with comprehensive medical information.",
    "anatomy": "Detailed anatomical description with structures, locations, and relationships. Include normal anatomy and any anatomical variations relevant to the condition.",
    "symptoms": ["detailed symptom 1 with description", "detailed symptom 2 with description", "detailed symptom 3 with description", "detailed symptom 4 with description", "detailed symptom 5 with description"],
    "diagnosis": {
      "clinicalPresentation": "Detailed presentation patterns and typical patient profiles",
      "differentialDiagnosis": ["condition 1 with brief description", "condition 2 with brief description", "condition 3 with brief description"],
      "diagnosticTests": ["test 1 with indication", "test 2 with indication", "test 3 with indication"],
      "redFlags": ["warning sign 1", "warning sign 2", "warning sign 3"]
    },
    "treatment": {
      "primaryTreatment": "Comprehensive evidence-based treatment approach with dosages and protocols",
      "alternatives": ["alternative 1 with indication", "alternative 2 with indication"],
      "contraindications": ["contraindication 1", "contraindication 2"],
      "sideEffects": ["side effect 1", "side effect 2", "side effect 3"],
      "monitoring": "What to monitor during treatment"
    },
    "caseStudy": {
      "patientPresentation": "Very detailed patient scenario: age, gender, chief complaint, detailed history of present illness, past medical history, family history, social history",
      "clinicalFindings": "Complete physical examination findings including vital signs, general appearance, and system-specific findings",
      "investigationResults": "Detailed laboratory results, imaging findings, and other diagnostic test results with normal ranges",
      "clinicalReasoning": "Step-by-step thought process leading to diagnosis",
      "diagnosis": "Final diagnosis with ICD code and explanation",
      "treatmentPlan": "Comprehensive step-by-step evidence-based treatment approach with rationale",
      "outcome": "Patient outcome, follow-up plan, prognosis, and patient education"
    },
    "complications": ["complication 1 with management", "complication 2 with management", "complication 3 with management"],
    "prognosis": "Detailed prognosis information with factors affecting outcome",
    "prevention": "Primary, secondary, and tertiary prevention strategies",
    "clinicalPearls": ["evidence-based clinical pearl 1", "evidence-based clinical pearl 2", "evidence-based clinical pearl 3"],
    "mnemonics": {
      "title": "Memory aid for key concepts",
      "mnemonic": "MNEMONIC",
      "explanation": "What each letter stands for with detailed clinical context"
    },
    "subFeatures": [
      {
        "title": "Pathophysiology",
        "description": "Very detailed pathophysiological mechanisms (200-400 words)",
        "clinicalSignificance": "How this pathophysiology affects patient care and treatment decisions",
        "practicalTips": ["clinical tip 1", "practical advice 2"]
      },
      {
        "title": "Epidemiology",
        "description": "Detailed epidemiological data, prevalence, incidence, demographics (150-300 words)",
        "clinicalSignificance": "Clinical relevance of epidemiological data",
        "practicalTips": ["population health consideration 1", "screening recommendation 2"]
      }
    ]
  }
]

Create very comprehensive medical content with extensive detail for medical education.
`;

// Generate chapter content for Programming category  
export const createProgrammingChapterContentPrompt = (chapterName, topic, level, chapterDescription = '') => `
Create programming content for chapter "${chapterName}" about ${topic} for ${level} level.

Chapter context: ${chapterDescription}

Include detailed code examples and explanations.

RESPOND WITH ONLY VALID JSON:
[
  {
    "title": "Main Programming Topic",
    "description": "Detailed explanation of the programming concept (200-500 words)",
    "codeExample": "// Detailed code example with comments\n// Show practical implementation\nfunction example() {\n  // code here\n}",
    "subFeatures": [
      {
        "title": "Implementation Details",
        "description": "How to implement this concept (100-300 words)",
        "codeExample": "// Code snippet showing implementation\nconst example = () => {\n  // implementation code\n};"
      },
      {
        "title": "Best Practices",
        "description": "Best practices and common patterns (100-300 words)",
        "codeExample": "// Example of best practices\n// Clean, readable code example"
      },
      {
        "title": "Common Mistakes",
        "description": "Common mistakes and how to avoid them (100-300 words)",
        "codeExample": "// Example of what NOT to do\n// and the correct approach"
      }
    ]
  },
  {
    "title": "Advanced Concepts",
    "description": "More advanced programming topics (200-500 words)",
    "codeExample": "// Advanced code example\n// Showing complex implementation",
    "subFeatures": [
      {
        "title": "Performance Optimization",
        "description": "How to optimize for better performance (100-300 words)",
        "codeExample": "// Optimized code example\n// Performance improvements"
      },
      {
        "title": "Real-world Application",
        "description": "How this applies in real projects (100-300 words)",
        "codeExample": "// Real-world usage example\n// Practical implementation"
      }
    ]
  }
]

Focus on practical code examples and clear explanations for programming concepts.
`;

// Generate chapter content for non-Health categories
export const createChapterContentPrompt = (chapterName, topic, level, chapterDescription = '') => `
Create content for chapter "${chapterName}" about ${topic} for ${level} level.

Chapter context: ${chapterDescription}

RESPOND WITH ONLY VALID JSON:
[
  {
    "title": "Main Topic",
    "description": "Detailed explanation of the topic (200-500 words)",
    "subFeatures": [
      {
        "title": "Subtopic 1",
        "description": "Detailed explanation (100-300 words)"
      },
      {
        "title": "Subtopic 2", 
        "description": "Detailed explanation (100-300 words)"
      },
      {
        "title": "Subtopic 3",
        "description": "Detailed explanation (100-300 words)"
      }
    ]
  },
  {
    "title": "Second Topic",
    "description": "Detailed explanation (200-500 words)",
    "subFeatures": [
      {
        "title": "Subtopic 1",
        "description": "Detailed explanation (100-300 words)"
      },
      {
        "title": "Subtopic 2",
        "description": "Detailed explanation (100-300 words)"
      }
    ]
  }
]

Keep the content simple and focused on the main concepts.
`;


// Legacy support - these are the functions the pages expect
export const GENERATE_COURSE_PROMPT = (category, topic, level, includeVideo, dynamicOptions = {}) => {
  // Use health-specific prompt for Health category
  if (category?.toLowerCase() === 'health') {
    return createHealthCoursePrompt(topic, level, dynamicOptions.courseDuration || '2 Hours', dynamicOptions.numberOfChapters || 6);
  }
  // Use general prompt for other categories
  return createCoursePrompt(category, topic, level, dynamicOptions.courseDuration || '2 Hours', dynamicOptions.numberOfChapters || 6);
};

export const GENERATE_CHAPTER_CONTENT_PROMPT = (chapterName, chapterDescription, courseContext, level) => {
  // Use health-specific prompt for Health category
  if (courseContext?.category?.toLowerCase() === 'health') {
    return createHealthChapterContentPrompt(chapterName, courseContext.topic || 'health', level, chapterDescription);
  }
  // Use programming-specific prompt for Programming category
  if (courseContext?.category?.toLowerCase() === 'programming') {
    return createProgrammingChapterContentPrompt(chapterName, courseContext.topic || 'programming', level, chapterDescription);
  }
  // Use general prompt for other categories
  return createChapterContentPrompt(chapterName, courseContext.topic || 'general', level, chapterDescription);
};

// Generate quiz prompts
export const createHealthQuizPrompt = (courseName, chapters, level) => `
Create a comprehensive medical quiz for the course "${courseName}" at ${level} level.

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:
- Generate EXACTLY 30 multiple-choice questions (not 29, not 31, exactly 30)
- Include questions from all chapters: ${chapters.map(ch => ch.chapterName || ch.chapter_name).join(', ')}
- Each question must have exactly 4 options
- Set correctAnswer as number (0, 1, 2, or 3)
- Include detailed explanations for correct answers
- Respond with ONLY valid JSON (no extra text)

Required JSON format - EXACTLY 30 questions:
{
  "title": "${courseName} - Medical Assessment Quiz",
  "description": "Comprehensive medical quiz covering key concepts from ${courseName}",
  "questions": [
    {
      "question": "Clinical scenario-based question with proper medical terminology",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed medical explanation with pathophysiology and clinical reasoning",
      "difficulty": "medium",
      "chapter": "Chapter name this question relates to"
    }
  ]
}

IMPORTANT: The questions array must contain exactly 30 question objects. Do not generate fewer than 30 questions.

MEDICAL QUIZ GUIDELINES:
- Include case-based scenarios and clinical vignettes
- Test understanding of pathophysiology and clinical decision-making
- Include diagnostic and treatment-related questions
- Focus on evidence-based medicine principles
- Use proper medical terminology and drug names
`;

export const createGeneralQuizPrompt = (courseName, chapters, level, category) => `
Create a comprehensive quiz for the course "${courseName}" in ${category} category at ${level} level.

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:
- Generate EXACTLY 30 multiple-choice questions (not 29, not 31, exactly 30)
- Include questions from all chapters: ${chapters.map(ch => ch.chapterName || ch.chapter_name).join(', ')}
- Each question must have exactly 4 options
- Set correctAnswer as number (0, 1, 2, or 3)
- Include detailed explanations for correct answers
- Respond with ONLY valid JSON (no extra text)

Required JSON format - EXACTLY 30 questions:
{
  "title": "${courseName} - Knowledge Assessment Quiz",
  "description": "Comprehensive quiz covering key concepts from ${courseName}",
  "questions": [
    {
      "question": "Clear and concise question testing understanding of key concepts",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of the correct answer and why other options are incorrect",
      "difficulty": "medium",
      "chapter": "Chapter name this question relates to"
    }
  ]
}

IMPORTANT: The questions array must contain exactly 30 question objects. Do not generate fewer than 30 questions.

QUIZ GUIDELINES:
- Test conceptual understanding and practical application
- Include both theoretical and practical questions
- Cover fundamental concepts and advanced topics appropriately
- Ensure questions are challenging but fair for the ${level} level
`;

export const GENERATE_QUIZ_PROMPT = (courseName, chapters, courseContext, level) => {
  // Use health-specific prompt for Health category
  if (courseContext?.category?.toLowerCase() === 'health') {
    return createHealthQuizPrompt(courseName, chapters, level);
  }
  // Use general prompt for other categories
  return createGeneralQuizPrompt(courseName, chapters, level, courseContext?.category || 'General');
};

// Generate flashcard prompts
export const createHealthFlashcardPrompt = (courseName, chapters, level) => `
Create medical flashcards for the course "${courseName}" at ${level} level.

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:
- Generate EXACTLY 30 flashcards (not 29, not 31, exactly 30)
- Cover content from all chapters: ${chapters.map(ch => ch.chapterName || ch.chapter_name).join(', ')}
- Focus on key medical concepts, definitions, and clinical knowledge
- Each flashcard needs front and back content
- Respond with ONLY valid JSON (no extra text)

Required JSON format - EXACTLY 30 flashcards:
{
  "title": "${courseName} - Medical Flashcards",
  "description": "Essential medical flashcards covering key concepts from ${courseName}",
  "flashcards": [
    {
      "front": "Clear, concise question or term (medical terminology, disease name, etc.)",
      "back": "Comprehensive answer with clinical details and key facts",
      "difficulty": "easy",
      "category": "anatomy",
      "tags": ["tag1", "tag2"],
      "chapter": "Chapter name this flashcard relates to"
    }
  ]
}

IMPORTANT: The flashcards array must contain exactly 30 flashcard objects.

MEDICAL FLASHCARD CATEGORIES: anatomy, pathophysiology, pharmacology, diagnosis, treatment, symptoms
DIFFICULTY LEVELS: easy, medium, hard
`;

export const createProgrammingFlashcardPrompt = (courseName, chapters, level) => `
Create programming flashcards for the course "${courseName}" at ${level} level.

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:
- Generate EXACTLY 30 flashcards (not 29, not 31, exactly 30)
- Cover content from all chapters: ${chapters.map(ch => ch.chapterName || ch.chapter_name).join(', ')}
- Focus on syntax, concepts, algorithms, and best practices
- Each flashcard needs front and back content
- Respond with ONLY valid JSON (no extra text)

Required JSON format - EXACTLY 30 flashcards:
{
  "title": "${courseName} - Programming Flashcards",
  "description": "Essential programming flashcards covering key concepts from ${courseName}",
  "flashcards": [
    {
      "front": "Programming question, syntax, or concept",
      "back": "Detailed explanation with code examples and best practices",
      "difficulty": "medium",
      "category": "syntax",
      "tags": ["javascript", "functions"],
      "chapter": "Chapter name this flashcard relates to"
    }
  ]
}

IMPORTANT: The flashcards array must contain exactly 30 flashcard objects.

PROGRAMMING CATEGORIES: syntax, algorithms, datastructures, concepts, bestpractices, debugging
DIFFICULTY LEVELS: easy, medium, hard
`;

export const createGeneralFlashcardPrompt = (courseName, chapters, level, category) => `
Create flashcards for the course "${courseName}" in ${category} category at ${level} level.

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:
- Generate EXACTLY 30 flashcards (not 29, not 31, exactly 30)
- Cover content from all chapters: ${chapters.map(ch => ch.chapterName || ch.chapter_name).join(', ')}
- Focus on key concepts, definitions, and important facts
- Each flashcard needs front and back content
- Respond with ONLY valid JSON (no extra text)

Required JSON format - EXACTLY 30 flashcards:
{
  "title": "${courseName} - Study Flashcards",
  "description": "Essential flashcards covering key concepts from ${courseName}",
  "flashcards": [
    {
      "front": "Clear, concise question or term",
      "back": "Comprehensive answer with detailed explanation",
      "difficulty": "medium",
      "category": "concepts",
      "tags": ["tag1", "tag2"],
      "chapter": "Chapter name this flashcard relates to"
    }
  ]
}

IMPORTANT: The flashcards array must contain exactly 30 flashcard objects.

GENERAL CATEGORIES: concepts, definitions, facts, applications, theory, practice
DIFFICULTY LEVELS: easy, medium, hard
`;

export const GENERATE_FLASHCARD_PROMPT = (courseName, chapters, courseContext, level) => {
  // Use health-specific prompt for Health category
  if (courseContext?.category?.toLowerCase() === 'health') {
    return createHealthFlashcardPrompt(courseName, chapters, level);
  }
  // Use programming-specific prompt for Programming category
  if (courseContext?.category?.toLowerCase() === 'programming') {
    return createProgrammingFlashcardPrompt(courseName, chapters, level);
  }
  // Use general prompt for other categories
  return createGeneralFlashcardPrompt(courseName, chapters, level, courseContext?.category || 'General');
};
