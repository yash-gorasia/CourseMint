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
Create comprehensive medical education content for the chapter "${chapterName}" about ${topic} for ${level} level medical students/professionals.

Chapter context: ${chapterDescription}

Create detailed medical content with the following structure:

RESPOND WITH ONLY VALID JSON:
[
  {
    "title": "Main Medical Topic",
    "description": "Comprehensive medical explanation with pathophysiology, etiology, and clinical significance (200-800 words)",
    "anatomyDescription": "Detailed anatomical structure description in text format",
    "symptoms": ["symptom1", "symptom2", "symptom3", "symptom4"],
    "diagnosis": {
      "differentialDiagnosis": ["condition1", "condition2", "condition3"],
      "diagnosticTests": ["test1", "test2", "test3"],
      "redFlags": ["warning sign1", "warning sign2", "warning sign3"]
    },
    "treatment": {
      "primaryTreatment": "Main evidence-based treatment approach",
      "alternatives": ["alternative1", "alternative2"],
      "contraindications": ["contraindication1", "contraindication2"],
      "sideEffects": ["side effect1", "side effect2"]
    },
    "caseStudy": {
      "patientPresentation": "Detailed patient scenario with age, gender, chief complaint, history of present illness, past medical history",
      "clinicalFindings": "Physical examination findings and vital signs",
      "investigationResults": "Laboratory results, imaging findings, and other diagnostic test results",
      "diagnosis": "Final diagnosis with ICD code if applicable",
      "treatmentPlan": "Step-by-step evidence-based treatment approach",
      "outcome": "Patient outcome, follow-up plan, and prognosis"
    },
    "clinicalPearls": ["evidence-based pearl1", "clinical tip2", "diagnostic pearl3"],
    "mnemonics": {
      "title": "Memory aid title",
      "mnemonic": "MNEMONIC",
      "explanation": "What each letter stands for with clinical context"
    },
    "subFeatures": [
      {
        "title": "Sub-topic title (e.g., pathophysiology, complications)",
        "description": "Detailed medical explanation (100-400 words)",
        "clinicalSignificance": "Why this matters clinically and how it affects patient care",
        "practicalTips": ["clinical tip1", "practical advice2"]
      }
    ]
  }
]

Medical Content Requirements for ${level} level:
${getHealthContentGuidelines(level)}

IMPORTANT: 
- Use evidence-based medical information
- Include proper medical terminology and drug names
- Focus on clinical decision-making and patient safety
- Provide realistic case scenarios
- Include differential diagnosis considerations
`;

// Generate chapter content for non-Health categories
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

// Health content guidelines helper
const getHealthContentGuidelines = (level) => {
  switch (level.toLowerCase()) {
    case 'beginner':
      return '- Use clear medical terminology with explanations\n- Focus on basic anatomy and physiology\n- Include common conditions and treatments\n- Emphasize patient safety and basic clinical skills\n- Provide simple diagnostic approaches';
    case 'intermediate': 
      return '- Assume basic medical knowledge\n- Include complex pathophysiology\n- Focus on differential diagnosis\n- Include pharmacology and drug interactions\n- Cover clinical decision-making scenarios';
    case 'advanced':
      return '- Use advanced medical terminology\n- Cover rare conditions and complex cases\n- Include latest research and evidence\n- Focus on specialist-level decision making\n- Include cutting-edge treatments and procedures';
    default:
      return '- Adapt to medical education level\n- Provide evidence-based information\n- Include clinical reasoning\n- Focus on patient-centered care';
  }
};

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
  // Use general prompt for other categories
  return createChapterContentPrompt(chapterName, courseContext.topic || 'programming', level, chapterDescription);
};

// Generate quiz prompts
export const createHealthQuizPrompt = (courseName, chapters, level) => `
Create a comprehensive medical quiz for the course "${courseName}" at ${level} level.

STRICT REQUIREMENTS:
- Generate exactly 10 multiple-choice questions
- Include questions from all chapters: ${chapters.map(ch => ch.chapterName || ch.chapter_name).join(', ')}
- Focus on clinical scenarios and diagnostic reasoning
- Each question must have exactly 4 options
- Include detailed explanations for correct answers
- Respond with ONLY valid JSON

JSON format:
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

MEDICAL QUIZ GUIDELINES:
- Include case-based scenarios and clinical vignettes
- Test understanding of pathophysiology and clinical decision-making
- Include diagnostic and treatment-related questions
- Focus on evidence-based medicine principles
- Use proper medical terminology and drug names
`;

export const createGeneralQuizPrompt = (courseName, chapters, level, category) => `
Create a comprehensive quiz for the course "${courseName}" in ${category} category at ${level} level.

STRICT REQUIREMENTS:
- Generate exactly 10 multiple-choice questions
- Include questions from all chapters: ${chapters.map(ch => ch.chapterName || ch.chapter_name).join(', ')}
- Each question must have exactly 4 options
- Include detailed explanations for correct answers
- Respond with ONLY valid JSON

JSON format:
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
