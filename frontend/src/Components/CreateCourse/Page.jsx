import React, { useState } from 'react'
import Header from '../Dashboard/Header'
import { HiMiniSquares2X2, HiLightBulb, HiClipboardDocumentCheck } from "react-icons/hi2";
import SelectCategory from './SelectCategory';
import TopicDescription from './TopicDescription';
import SelectOption from './SelectOption';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep as nextStepAction, prevStep as prevStepAction } from '../../redux/feature/courseInputSlice';
import { generateCourseLayout_AI } from '../../configs/AiModel';
import Loader from '../../utils/Loader';
import { useUser } from '@clerk/clerk-react';
import { useAddCourseMutation } from '../../redux/api/courseSlice';
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
    const [loader, setLoader] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const { user } = useUser();

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
    }; const generateCourseLayout = async () => {
        setLoader(true);
        setNotification({ show: false, type: '', message: '' });

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
            const response = await generateCourseLayout_AI(FINAL_PROMPT);
            const cleaned = extractJson(response);
            const parsedResult = JSON.parse(cleaned);
            console.log(parsedResult);

            // Save course to the backend using RTK Query mutation
            const courseData = {
                courseId: uuidv4(),
                name: courseTitle,
                category: courseCategory,
                level: selectedOptions?.difficulty?.value || selectedOptions?.difficulty,
                courseOutput: parsedResult,
                userName: user?.fullName || user?.username || null
            };

            const result = await addCourse(courseData).unwrap();
            setLoader(false);
            setNotification({
                show: true,
                type: 'success',
                message: 'Course created successfully!'
            });
            console.log('Course saved successfully:', result);

        } catch (err) {
            setLoader(false);
            setNotification({
                show: true,
                type: 'error',
                message: `Failed to ${err.status ? 'save' : 'generate'} course: ${err.data?.message || err.message || 'Unknown error'}`
            });
            console.error("Failed to generate or save course:", err);
        }
    }; return (
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

            {/* Notification message */}
            {notification.show && (
                <div className={`fixed top-5 right-5 p-4 rounded-md shadow-md ${notification.type === 'success' ? 'bg-green-100 text-green-700' :
                        notification.type === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                    }`}>
                    {notification.message}
                    <button
                        className="ml-3 text-sm font-medium underline"
                        onClick={() => setNotification({ ...notification, show: false })}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Loader */}
            {(loader || isLoading) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 opacity-80">
                    <Loader />
                </div>
            )}
        </div>);
}

export default Page;
