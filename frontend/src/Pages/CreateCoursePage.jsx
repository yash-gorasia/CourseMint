import React,{useState} from 'react'
import Header from '../Components/Dashboard/Header'
import { HiMiniSquares2X2, HiLightBulb, HiClipboardDocumentCheck } from "react-icons/hi2";
import SelectCategory from '../Components/CreateCourse/SelectCategory';
import TopicDescription from '../Components/CreateCourse/TopicDescription';
import SelectOption from '../Components/CreateCourse/SelectOption';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep as nextStepAction, prevStep as prevStepAction } from '../redux/feature/courseInputSlice.js';
import { generate_AI } from '../configs/AiModel.jsx';
import { GENERATE_COURSE_PROMPT } from '../configs/PromptTemplates.jsx';
import { DataValidator } from '../utils/DataValidator.js';
import Loader from '../utils/Loader';
import { useUser } from '@clerk/clerk-react';
import { useAddCourseMutation } from '../redux/api/courseSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const CreateCoursePage = () => {
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  // RTK Query hook for adding a course
  const [addCourse, { isLoading }] = useAddCourseMutation();

  const stepperOptions = [
    {
      id: 1,
      name: "Category",
      icon: <HiMiniSquares2X2 />
    },
    {
      id: 2,
      name: "Topic & Desc",
      icon: <HiLightBulb />
    },
    {
      id: 3,
      name: "Options",
      icon: <HiClipboardDocumentCheck />
    },
  ]
  const dispatch = useDispatch();
  const { courseCategory, courseTitle, selectedOptions, activeStep } = useSelector(state => state.courseInput);

  const handleNext = () => {
    dispatch(nextStepAction());
  };

  const handlePrev = () => {
    dispatch(prevStepAction());
  };

  const generateCourseLayout = async () => {
    setLoader(true);

    try {
      // Get course generation parameters
      const category = courseCategory;
      const topic = courseTitle;
      const level = (selectedOptions?.difficulty?.value || selectedOptions?.difficulty || 'beginner').toLowerCase();
      const includeVideo = (selectedOptions?.includeVideo?.value || selectedOptions?.includeVideo) === 'Yes';
      
      // Extract dynamic options
      const courseDuration = selectedOptions?.duration?.value || selectedOptions?.duration || '2 Hours';
      const numberOfChapters = parseInt(selectedOptions?.chapters || 6);

      // Validate inputs
      if (!category || !topic) {
        toast.error('Please select a category and enter a topic');
        setLoader(false);
        return;
      }

      if (numberOfChapters < 1 || numberOfChapters > 15) {
        toast.error('Number of chapters must be between 1 and 15');
        setLoader(false);
        return;
      }

      // Create options object for dynamic prompt
      const dynamicOptions = {
        courseDuration,
        numberOfChapters
      };

      // Generate strict prompt with dynamic options
      const prompt = GENERATE_COURSE_PROMPT(category, topic, level, includeVideo, dynamicOptions);
      console.log('Generated prompt with options:', { category, topic, level, includeVideo, dynamicOptions });

      // Generate course content using AI with validation
      const aiResponse = await generate_AI(prompt, 'course');
      console.log('AI Response:', aiResponse);

      // Validate the AI response
      const validation = DataValidator.validateCourseOutput(aiResponse);
      
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        toast.error(`AI generated invalid data: ${validation.errors.join(', ')}`);
        setLoader(false);
        return;
      }

      // Verify chapter count matches user request
      if (validation.normalized.chapters.length !== numberOfChapters) {
        console.warn(`Expected ${numberOfChapters} chapters, got ${validation.normalized.chapters.length}`);
        toast.warning(`Generated ${validation.normalized.chapters.length} chapters instead of requested ${numberOfChapters}`);
      }

      // Use validated and normalized data
      const normalizedCourseOutput = validation.normalized;

      const courseData = {
        name: courseTitle,
        category: courseCategory,
        level: level,
        includeVideo: includeVideo,
        courseOutput: normalizedCourseOutput,
        userEmail: user?.emailAddresses[0]?.emailAddress || null
      };

      console.log('Course data to save:', courseData);

      const result = await addCourse(courseData).unwrap();
      toast.success(`Course generated successfully with ${normalizedCourseOutput.chapters.length} chapters!`);
      const courseId = result?.id;
      navigate(`/course/${courseId}`);
      setLoader(false);
      console.log('Course saved successfully:', result);

    } catch (err) {
      setLoader(false);
      toast.error('Failed to generate or save course. Please try again.');
      console.error("Failed to generate or save course:", err);
    }
  };

  return (
    <div>
      <Header />
      
      {/* stepper */}
      <div className='flex flex-col justify-center items-center mt-10'>
        <h2 className='text-4xl text-green-500 font-medium'>Create Course</h2>
        <div className='flex mt-10'>
          {stepperOptions.map(item => (
            <div key={item.id} className='flex items-center'>
              <div className='flex flex-col items-center w-[50px] md:w-[100px]'>
                <div className={`bg-gray-300 text-white rounded-full p-3 ${activeStep >= item.id && 'bg-green-400'}`}>
                  {item.icon}
                </div>
                <h2 className='hidden md:block md:text-sm'>{item.name}</h2>
              </div>
              {item.id != stepperOptions?.length && <div className={`h-1 rounded-full w-[50px] md:w-[100px] lg:w-[140px] bg-gray-400 ${activeStep - 1 >= item.id && 'bg-green-400'}`}></div>}
            </div>
          ))}
        </div>
      </div>
      <div className='px-10 md:px-20 lg:px-44 mt-10'>
        {/* Components */}
        {activeStep == 1 ? <SelectCategory /> :
          activeStep == 2 ? <TopicDescription /> :
            <SelectOption />
        }

        {/* Next and Previous Button */}
        <div className='flex justify-between mt-10'>
          <button
            disabled={activeStep == 1}
            onClick={handlePrev}
            className={`border border-green-500 font-semibold text-black p-2 rounded-md cursor-pointer ${activeStep == 1 ? 'opacity-50' : ''}`}
          >Previous</button>
          {activeStep < 3 && <button
            onClick={handleNext}
            className='bg-green-500 font-semibold text-white p-2 rounded-md cursor-pointer'
          >Next</button>}
          {activeStep == 3 && <button
            className='bg-green-500 text-white p-2 rounded-md cursor-pointer'
            onClick={generateCourseLayout}
            disabled={isLoading || loader}
          >
            {isLoading || loader ? 'Generating...' : 'Generate Course Layout'}
          </button>}
        </div>
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

export default CreateCoursePage
