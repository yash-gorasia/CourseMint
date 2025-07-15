import React, { useState } from 'react'
import Header from '../Components/Dashboard/Header'
import { useParams } from 'react-router-dom'
import { useGetCourseQuery } from '../redux/api/courseSlice.js'
import BasicInfo from '../Components/CourseLayout/BasicInfo'
import ChapterList from '../Components/CourseLayout/ChapterList.jsx'
import { generate_AI } from '../configs/AiModel'
import Loader from '../utils/Loader'
import getVideos from '../configs/Service.jsx'
import { useAddChapterMutation } from '../redux/api/chapterSlice.js'

const CoursePage = () => {
  const [loader, setLoader] = useState(false);
  const { courseId } = useParams()
  const { data: res, isLoading, isError } = useGetCourseQuery(courseId)
  const course = res?.course;
  const [addChapter] = useAddChapterMutation();

  const generateCourseContent = () => {
    setLoader(true);
    const chapters = course?.courseOutput?.chapters || []
    const courseName = course?.courseOutput?.courseName || course?.courseOutput?.course_name || N / A

    chapters.forEach(async (chapter, index) => {
      const PROMPT = `Explain the concept in Detail on Topic: ${courseName}, Chapter: ${chapter?.chapterName}, in JSON format with list of array with field as title, desctiption in detail Code Example(Code field in <precode> format) if applicable`;
      const extractJson = (text) => {
        const match = text.match(/```json\s*([\s\S]*?)```/);
        if (match) return match[1];
        return text.trim(); // fallback if no ```json ... ``` block found
      };

      try {
        setLoader(true);
        let videoId = '';

        // Generate Video URL
        getVideos(courseName + ':' + chapter?.chapterName || chapter?.chapter_name).then(res => {
          console.log(res);
          videoId = res[0]?.id?.videoId || '';
        })

        // Generate AI content
        const response = await generate_AI(PROMPT);
        const cleaned = extractJson(response);
        const parsedResult = JSON.parse(cleaned);
        console.log(parsedResult);

        // Save chp content + URL
        const chapterContent = {
          courseId: courseId,
          content: parsedResult,
          videoId: videoId
        };
        const res = await addChapter(chapterContent).unwrap();
        console.log("Chapter added successfully:", res);

        setLoader(false);
      }
      catch (err) {
        setLoader(false);
        console.error("Error generating course content:", err);
      }
    })
  }

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
