import React from 'react'
import Header from '../Dashboard/Header'
import { HiMiniSquares2X2, HiLightBulb, HiClipboardDocumentCheck } from "react-icons/hi2";
import SelectCategory from './SelectCategory';
import TopicDescription from './TopicDescription';
import SelectOption from './SelectOption';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep as nextStepAction, prevStep as prevStepAction } from '../../redux/courseSlice';

const Page = () => {
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
    ]    // Using Redux hooks
    const dispatch = useDispatch();
    const { activeStep, courseCategory } = useSelector(state => state.course);
    
    const handleNext = () => {
        dispatch(nextStepAction());
    };
    
    const handlePrev = () => {
        dispatch(prevStepAction());
    };

    console.log(courseCategory);
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

                {/* Next and Previous Button */}                <div className='flex justify-between mt-10'>
                    <button
                        disabled={activeStep == 1}
                        onClick={handlePrev}
                        className={`border border-green-500 font-semibold text-black  p-2 rounded-md cursor-pointer `}
                    >Previous</button>
                    {activeStep < 3 && <button
                        onClick={handleNext}
                        className='bg-green-500 font-semibold text-white p-2 rounded-md cursor-pointer'
                    >Next</button>}                {activeStep == 3 && <button className='bg-green-500 text-white p-2 rounded-md cursor-pointer'>Generate Course Layout</button>}
                </div>
            </div>
        </div>
    )
}

export default Page
