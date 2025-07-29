import React, { useState } from 'react'
import Header from '../Components/Dashboard/Header'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetCourseQuery } from '../redux/api/courseSlice.js'
import BasicInfo from '../Components/CourseLayout/BasicInfo'
import ChapterList from '../Components/CourseLayout/ChapterList.jsx'
import { generate_AI } from '../configs/AiModel'
import { GENERATE_CHAPTER_CONTENT_PROMPT, GENERATE_QUIZ_PROMPT } from '../configs/PromptTemplates.jsx'
import { DataValidator, validateQuizContent } from '../utils/DataValidator.js'
import Loader from '../utils/Loader'
import getVideos from '../configs/Service.jsx'
import { useAddChapterMutation } from '../redux/api/chapterSlice.js'
import { useCreateQuizMutation, useGetQuizzesByCourseQuery } from '../redux/api/quizSlice.js'
import { toast } from 'react-toastify'

const CoursePage = () => {
  const [loader, setLoader] = useState(false);
  const [quizLoader, setQuizLoader] = useState(false);
  const [showQuizList, setShowQuizList] = useState(false);
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { data: res, isLoading, isError } = useGetCourseQuery(courseId)
  const course = res?.course;
  const [addChapter] = useAddChapterMutation();
  const [createQuiz] = useCreateQuizMutation();
  const { data: quizzesData } = useGetQuizzesByCourseQuery(courseId);

  const generateQuiz = async () => {
    // Check if quiz already exists
    if (quizzesData?.quizzes?.length > 0) {
      toast.info('Quiz already exists for this course. Click "Take Quiz" to start.');
      navigate(`/quiz/${quizzesData.quizzes[0]._id}`);
      return;
    }

    setQuizLoader(true);
    try {
      const chapters = course?.courseOutput?.chapters || [];
      const courseName = course?.courseOutput?.courseName || course?.courseOutput?.course_name || 'Course';
      const courseCategory = course?.category || 'General';
      const courseLevel = course?.level || 'intermediate';

      if (chapters.length === 0) {
        toast.error('No chapters found to generate quiz from');
        setQuizLoader(false);
        return;
      }

      console.log(`Generating quiz for course: ${courseName} (${courseCategory}, ${courseLevel})`);

      // Generate quiz using AI
      const courseContext = {
        category: courseCategory,
        topic: courseName,
        courseName: courseName
      };

      const prompt = GENERATE_QUIZ_PROMPT(courseName, chapters, courseContext, courseLevel);
      console.log(`Generated quiz prompt:`, prompt);

      const aiResponse = await generate_AI(prompt, 'quiz');
      console.log(`AI Quiz Response:`, aiResponse);
      console.log(`AI Response type:`, typeof aiResponse);
      
      // Validate the AI response
      const validation = validateQuizContent(aiResponse);
      
      if (!validation.isValid) {
        console.error(`Quiz validation errors:`, validation.errors);
        console.error(`AI Response structure:`, JSON.stringify(aiResponse, null, 2));
        toast.error(`Failed to generate valid quiz content: ${validation.errors.join(', ')}`);
        setQuizLoader(false);
        return;
      }

      // Create quiz data
      const quizData = {
        courseId: courseId,
        title: validation.normalized.title,
        description: validation.normalized.description,
        questions: validation.normalized.questions,
        category: courseCategory,
        level: courseLevel,
        timeLimit: validation.normalized.timeLimit,
        passingScore: validation.normalized.passingScore
      };

      console.log(`Creating quiz with data:`, quizData);
      const result = await createQuiz(quizData).unwrap();
      console.log(`Quiz created successfully:`, result);

      toast.success('Quiz generated successfully!');
      
      // Navigate to quiz page
      navigate(`/quiz/${result.quiz._id}`);

    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setQuizLoader(false);
    }
  };

  const generateCourseContent = async () => {
    setLoader(true);
    const chapters = course?.courseOutput?.chapters || [];
    const courseName = course?.courseOutput?.courseName || course?.courseOutput?.course_name || 'Course';
    const courseCategory = course?.category || 'General';
    const courseLevel = course?.level || 'intermediate'; // Get the course difficulty level

    if (chapters.length === 0) {
      toast.error('No chapters found to generate content for');
      setLoader(false);
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index];
      const chapterName = chapter?.chapterName || chapter?.chapter_name || `Chapter ${index + 1}`;
      const chapterDescription = chapter?.chapterDescription || chapter?.chapter_description || chapter?.description || '';

      console.log(`Generating content for Chapter ${index + 1}: ${chapterName} (Level: ${courseLevel})`);

      try {
        let videoId = '';

        // Generate Video URL first
        try {
          const videoQuery = `${courseName}: ${chapterName}`;
          const videoResults = await getVideos(videoQuery);
          videoId = videoResults?.[0]?.id?.videoId || '';
          console.log(`Video ID for ${chapterName}:`, videoId);
        } catch (videoError) {
          console.warn(`Failed to get video for ${chapterName}:`, videoError);
          videoId = '';
        }

        // Generate strict prompt for chapter content with difficulty level
        const courseContext = {
          category: courseCategory,
          topic: courseName,
          courseName: courseName
        };
        const prompt = GENERATE_CHAPTER_CONTENT_PROMPT(chapterName, chapterDescription, courseContext, courseLevel);
        console.log(`Generated prompt for ${chapterName} (${courseLevel} level, Category: ${courseCategory}):`, prompt);

        // Generate AI content with validation
        const aiResponse = await generate_AI(prompt, 'chapter');
        console.log(`AI Response for ${chapterName}:`, aiResponse);

        // Validate the AI response
        const validation = DataValidator.validateChapterContent(aiResponse);
        
        if (!validation.isValid) {
          console.error(`Validation errors for ${chapterName}:`, validation.errors);
          errorCount++;
          continue; // Skip this chapter but continue with others
        }

        // Use validated and normalized data
        const normalizedContent = validation.normalized;

        // Save chapter content
        const chapterContent = {
          courseId: courseId,
          content: normalizedContent,
          videoId: videoId
        };

        console.log(`Saving chapter content for ${chapterName}:`, chapterContent);
        const result = await addChapter(chapterContent).unwrap();
        console.log(`Chapter ${chapterName} added successfully:`, result);
        successCount++;

        // Add a small delay between chapters to avoid rate limiting
        if (index < chapters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (err) {
        console.error(`Error generating content for ${chapterName}:`, err);
        errorCount++;
      }
    }

    setLoader(false);
    
    // Show final results
    if (successCount > 0) {
      toast.success(`Successfully generated ${courseLevel} level content for ${successCount} chapter(s)`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to generate content for ${errorCount} chapter(s)`);
    }
  };

  return (
    <div>
      <Header />

      <div className='mt-10 px-7 md:px-20 lg:px-44'>
        <h2 className='font-bold text-center text-2xl'>Course Layout</h2>

        {/* Basic Info */}
        <BasicInfo course={course} />

        {/* Feature Cards */}
        <div className='my-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Quiz Card */}
          <div 
            className='bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer'
            onClick={quizzesData?.quizzes?.length > 0 ? () => navigate(`/quiz/${quizzesData.quizzes[0]._id}`) : generateQuiz}
          >
            <div className='flex items-center justify-center mb-4'>
              <div className='bg-green-500 text-white rounded-full p-3'>
                {quizLoader ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
            </div>
            <h3 className='text-lg font-semibold text-center text-green-800 mb-2'>
              {quizLoader 
                ? 'Generating Quiz...' 
                : quizzesData?.quizzes?.length > 0 
                  ? 'Take Quiz' 
                  : 'Generate Quiz'
              }
            </h3>
            <p className='text-sm text-gray-600 text-center'>
              {quizLoader 
                ? 'Creating interactive quiz from course content...' 
                : quizzesData?.quizzes?.length > 0
                  ? 'Click to start your course quiz'
                  : 'Generate a quiz based on course content (one-time only)'
              }
            </p>
            {quizzesData?.quizzes?.length > 0 ? (
              <div className='mt-4 space-y-2'>
                <div className='text-center'>
                  <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                    Quiz Available - {quizzesData.quizzes[0].questions?.length || 0} Questions
                  </span>
                </div>
                <div className='flex gap-2 justify-center'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/quiz/${quizzesData.quizzes[0]._id}`);
                    }}
                    className='text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
                  >
                    Start Quiz
                  </button>
                </div>
                <div className='text-center'>
                  <span className='text-xs text-gray-500'>
                    Quiz created on {new Date(quizzesData.quizzes[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className='mt-4 text-center'>
                <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                  Click to create your course quiz
                </span>
              </div>
            )}
          </div>

          {/* Flashcards Card */}
          <div className='bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center justify-center mb-4'>
              <div className='bg-green-500 text-white rounded-full p-3'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 className='text-lg font-semibold text-center text-green-800 mb-2'>Flashcards</h3>
            <p className='text-sm text-gray-600 text-center'>Study key concepts with digital flashcards for better retention</p>
            <div className='mt-4 text-center'>
              <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>Coming Soon</span>
            </div>
          </div>

          {/* Q&A Card */}
          <div className='bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center justify-center mb-4'>
              <div className='bg-green-500 text-white rounded-full p-3'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className='text-lg font-semibold text-center text-green-800 mb-2'>Q&A</h3>
            <p className='text-sm text-gray-600 text-center'>Get answers to frequently asked questions about the course topics</p>
            <div className='mt-4 text-center'>
              <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* List of Chapteres */}
        <ChapterList course={course} />

        <button
          className='my-10 bg-green-500 text-white font-semibold p-2 rounded-md cursor-pointer'
          onClick={generateCourseContent}
        >Generate Course Content</button>
      </div>
      

      
      {/* Loader */}
      {(loader || isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 opacity-80">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default CoursePage
