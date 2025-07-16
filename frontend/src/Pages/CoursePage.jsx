import React, { useState } from 'react'
import Header from '../Components/Dashboard/Header'
import { useParams } from 'react-router-dom'
import { useGetCourseQuery } from '../redux/api/courseSlice.js'
import BasicInfo from '../Components/CourseLayout/BasicInfo'
import ChapterList from '../Components/CourseLayout/ChapterList.jsx'
import { generate_AI } from '../configs/AiModel'
import { GENERATE_CHAPTER_CONTENT_PROMPT } from '../configs/PromptTemplates.jsx'
import { DataValidator } from '../utils/DataValidator.js'
import Loader from '../utils/Loader'
import getVideos from '../configs/Service.jsx'
import { useAddChapterMutation } from '../redux/api/chapterSlice.js'
import { toast } from 'react-toastify'

const CoursePage = () => {
  const [loader, setLoader] = useState(false);
  const { courseId } = useParams()
  const { data: res, isLoading, isError } = useGetCourseQuery(courseId)
  const course = res?.course;
  const [addChapter] = useAddChapterMutation();

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
        const prompt = GENERATE_CHAPTER_CONTENT_PROMPT(chapterName, chapterDescription, courseCategory, courseLevel);
        console.log(`Generated prompt for ${chapterName} (${courseLevel} level):`, prompt);

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
