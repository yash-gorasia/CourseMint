import React,{useState} from 'react'
import Header from '../Components/Dashboard/Header'
import { HiMiniSquares2X2, HiLightBulb, HiClipboardDocumentCheck } from "react-icons/hi2";
import SelectCategory from '../Components/CreateCourse/SelectCategory';
import TopicDescription from '../Components/CreateCourse/TopicDescription';
import SelectOption from '../Components/CreateCourse/SelectOption';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep as nextStepAction, prevStep as prevStepAction } from '../redux/feature/courseInputSlice.js';
import { generate_AI } from '../configs/AiModel.jsx';
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

    const BASIC_PROMPT = 'Generate a course tutorial with the following details: Include course name, description, chapters with name, about section, and duration. Format it as JSON.\n';
    const USER_INPUT_PROMPT = `Category: ${courseCategory}, Topic: ${courseTitle}, Level: ${selectedOptions?.difficulty?.value || selectedOptions?.difficulty}, Duration: ${selectedOptions?.duration?.value || selectedOptions?.duration}, No. of Chapters: ${selectedOptions?.chapters?.value || selectedOptions?.chapters}`;
    const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;

    const extractJson = (text) => {
      const match = text.match(/```json\s*([\s\S]*?)```/);
      if (match) return match[1];
      return text.trim(); // fallback if no ```json ... ``` block found
    };

    try {
      // Generate course content using AI
      const response = await generate_AI(FINAL_PROMPT);
      const cleaned = extractJson(response);
      const parsedResult = JSON.parse(cleaned);
      console.log(parsedResult);

      const courseData = {
        name: courseTitle,
        category: courseCategory,
        level: selectedOptions?.difficulty?.value || selectedOptions?.difficulty,
        includeVideo: selectedOptions?.includeVideo?.value || selectedOptions?.includeVideo,
        courseOutput: parsedResult,
        userEmail: user?.emailAddresses[0]?.emailAddress || null
      };

      const result = await addCourse(courseData).unwrap();
      toast.success('Course generated and saved successfully!');
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
