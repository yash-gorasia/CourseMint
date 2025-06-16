# AI Model Integration for Course Generation

This document explains how to use the AI model integration in the CourseMint application.

## Overview

The `AiModel.jsx` file exports a custom hook `useAiModel()` that provides functionality to interact with the Google Generative AI (Gemini) API to generate course content based on user input.

## Setup Requirements

1. Install the required package:
   ```bash
   npm install @google/generative-ai
   ```

2. Create an environment variable in your `.env` or `.env.local` file:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

## How to Use the AI Model Hook

### 1. Import and Initialize the Hook

```jsx
import { useAiModel } from '../../configs/AiModel';

const MyComponent = () => {
  // Initialize the hook
  const { generateCourse, loading, error, courseData } = useAiModel();
  
  // Rest of your component
};
```

### 2. Generate Course Content

```jsx
const handleGenerate = async () => {
  try {
    const promptData = {
      category: 'Programming',
      topic: 'JavaScript',
      level: 'Intermediate',
      duration: '2 Hours',
      chapters: 5
    };
    
    const result = await generateCourse(promptData);
    console.log(result);
    
    // Do something with the generated course data
  } catch (error) {
    console.error('Failed to generate course:', error);
  }
};
```

### 3. Access the Generated Data and Status

You can access the current state of the AI process:

- `loading`: Boolean indicating if the AI is currently generating content
- `error`: Any error that occurred during generation
- `courseData`: The latest successfully generated course data

### 4. Handling the Response

The response will be a JSON object with the following structure:

```json
{
  "Course Name": "JavaScript for Intermediate Developers",
  "Description": "A comprehensive guide to JavaScript concepts...",
  "Category": "Programming",
  "Topic": "JavaScript",
  "Level": "Intermediate",
  "Duration": "2 Hours",
  "NoOf Chapters": 5,
  "chapters": [
    {
      "Chapter Name": "Advanced Functions",
      "about": "Learn about closures, callbacks, and higher-order functions",
      "Duration": "30 minutes"
    },
    // More chapters...
  ]
}
```

## Example Integration

```jsx
import React, { useState } from 'react';
import { useAiModel } from '../../configs/AiModel';

const CourseGenerator = () => {
  const { generateCourse, loading, error, courseData } = useAiModel();
  const [category, setCategory] = useState('Programming');
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateCourse({
        category,
        topic,
        level: 'Beginner',
        duration: '1 hour',
        chapters: 3
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Course'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      
      {courseData && (
        <div className="result">
          <h2>{courseData["Course Name"]}</h2>
          <p>{courseData.Description}</p>
          {/* Display other course data */}
        </div>
      )}
    </div>
  );
};

export default CourseGenerator;
```

## Important Notes

1. You need a valid Gemini API key to use this feature
2. Course generation can take some time, so handle loading states appropriately
3. Error handling is important as AI responses can sometimes fail
4. The AI model expects specific parameters, ensure all are provided with appropriate values
