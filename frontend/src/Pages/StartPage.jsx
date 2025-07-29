import React, { useEffect, useState } from 'react'
import { useGetCourseQuery } from '../redux/api/courseSlice.js'
import { useGetChaptersByCourseIdQuery, useGetChapterQuery } from '../redux/api/chapterSlice.js'
import { useParams } from 'react-router-dom'
import ChapterListCard from '../Components/Start/ChapterListCard'
import ChapterContent from '../Components/Start/ChapterContent'
import { safeDataAccess } from '../utils/DataValidator.js'

const Page = () => {
  const { courseId } = useParams();
  const { data, isLoading, isError } = useGetCourseQuery(courseId);
  const { data: chaptersData, isLoading: chaptersLoading } = useGetChaptersByCourseIdQuery(courseId);
  
  const [course, setCourse] = useState({});
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedChapterBasicInfo, setSelectedChapterBasicInfo] = useState(null);

  // Fetch detailed chapter content when a chapter is selected
  const { 
    data: chapterContentData, 
    isLoading: isChapterContentLoading,
    refetch: refetchChapterContent 
  } = useGetChapterQuery(selectedChapterId, {
    skip: !selectedChapterId, // Skip the query if no chapter is selected
    refetchOnMountOrArgChange: true, // Always refetch when chapter ID changes
  });

  useEffect(() => {
    if (data?.course) {
      setCourse(data.course);
    }
  }, [data])

  // Auto-select first chapter when chapters are loaded
  useEffect(() => {
    if (chaptersData?.chapters && chaptersData.chapters.length > 0 && !selectedChapterId) {
      const firstChapter = chaptersData.chapters[0];
      setSelectedChapterId(firstChapter._id);
      
      // Also set the basic info from course chapters
      const courseChapters = course?.courseOutput?.chapters || [];
      if (courseChapters.length > 0) {
        setSelectedChapterBasicInfo(courseChapters[0]);
      }
    }
  }, [chaptersData, course, selectedChapterId]);

  const courseName = safeDataAccess(course, 'courseOutput.courseName') || 
                    safeDataAccess(course, 'courseOutput.course_name') || 
                    'Course';
  const courseChapters = safeDataAccess(course, 'courseOutput.chapters') || [];
  const dbChapters = safeDataAccess(chaptersData, 'chapters') || [];

  // Combine course chapter info with database chapters with enhanced matching
  const combinedChapters = courseChapters.map((courseChapter, index) => {
    // Get chapter name from either field with normalization
    const chapterName = (courseChapter.chapterName || courseChapter.chapter_name || '').trim();
    
    // Enhanced matching algorithm
    let dbChapter = null;
    
    // 1. Try exact index match first (most reliable)
    if (dbChapters[index]) {
      dbChapter = dbChapters[index];
    }
    
    // 2. Try exact name match
    if (!dbChapter && chapterName) {
      dbChapter = dbChapters.find(ch => {
        const dbTitle = (ch.content?.title || '').trim().toLowerCase();
        return dbTitle === chapterName.toLowerCase();
      });
    }
    
    // 3. Try partial name match
    if (!dbChapter && chapterName) {
      dbChapter = dbChapters.find(ch => {
        const dbTitle = (ch.content?.title || '').trim().toLowerCase();
        return dbTitle.includes(chapterName.toLowerCase()) || 
               chapterName.toLowerCase().includes(dbTitle);
      });
    }
    
    return {
      ...courseChapter,
      chapterName: chapterName, // Normalized name
      _id: dbChapter?._id,
      hasContent: !!dbChapter,
      dbChapter: dbChapter // Store the full db chapter for easier access
    };
  });

  const handleChapterSelect = (chapter, index) => {
    console.log('Selected chapter:', chapter);
    
    // Set basic info first (this will update the title immediately)
    setSelectedChapterBasicInfo(chapter);
    
    // Get chapter name from either field
    const chapterName = chapter.chapterName || chapter.chapter_name;
    
    // Try to find the matching database chapter
    let dbChapter = chapter.dbChapter;
    
    if (!dbChapter) {
      // Try matching by index first (most reliable)
      dbChapter = dbChapters[index];
    }
    
    if (!dbChapter) {
      // Try matching by title similarity
      dbChapter = dbChapters.find(ch => 
        ch.content?.title?.toLowerCase().includes(chapterName?.toLowerCase()) ||
        chapterName?.toLowerCase().includes(ch.content?.title?.toLowerCase())
      );
    }
    
    if (dbChapter) {
      console.log('Found matching DB chapter:', dbChapter);
      setSelectedChapterId(dbChapter._id);
    } else {
      console.log('No matching DB chapter found, showing basic info only');
      setSelectedChapterId(null);
    }
  };

  if (isLoading || chaptersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading course content...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Chapter list sidebar */}
      <div className='w-80 border-r shadow-md bg-white'>
        <h2 className='font-medium text-lg bg-green-500 p-4 text-white'>{courseName}</h2>

        <div className="overflow-y-auto h-full pb-20">
          {combinedChapters.map((chapter, index) => (
            <div
              key={index}
              className={`hover:cursor-pointer hover:bg-green-50 transition-colors ${
                (selectedChapterBasicInfo?.chapterName === chapter.chapterName || 
                 selectedChapterBasicInfo?.chapter_name === chapter.chapter_name) ? 'border-green-500' : 'bg-white'
              } ${!chapter.hasContent ? 'opacity-50' : ''}`}
              onClick={() => handleChapterSelect(chapter, index)}
            >
              <ChapterListCard chapter={chapter} index={index} />
              {!chapter.hasContent && (
                <div className="px-4 pb-2">
                  <span className="text-xs text-red-500">Content not available</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {!selectedChapterBasicInfo ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">Select a chapter to view its content</p>
          </div>
        ) : isChapterContentLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <ChapterContent 
            key={selectedChapterBasicInfo?.chapterName} // Force re-render when chapter name changes
            chapter={chapterContentData?.chapter}
            basicInfo={selectedChapterBasicInfo}
            course={data?.course}
          />
        )}
      </div>
    </div>
  )
}

export default Page