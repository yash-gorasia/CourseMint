import React from 'react'
import { HiOutlineClock, HiOutlineCheckCircle } from "react-icons/hi2";

const ChapterList = ({ course }) => {    
    const chapters = course?.courseOutput?.chapters || [];
    

    return (
        <div className='mt-3'>
            <h2 className='font-medium text-xl'>Chapters</h2>
            <div className='mt-2'>
                {chapters.map((chapter, index) => (
                    <div key={index} className='border rounded-lg shadow-sm p-4 mb-2 flex justify-between items-center hover:bg-gray-50 transition-colors'>
                        <div className='flex items-center gap-5 mb-2'>
                            <h2 className='bg-green-500 flex-none h-10 w-10 text-white rounded-full text-center p-2'>{index+1}</h2>
                            <div>
                                <h2 className='font-medium text-lg'>{chapter?.chapterName || chapter?.chapter_name}</h2>
                                <p className='text-sm text-gray-500 mb-2'>
                                    {chapter?.chapterDescription || chapter?.chapter_description || chapter?.description || chapter?.about || 'No description available'}
                                </p>
                                <p className='flex gap-2 text-green-700 items-center'> <HiOutlineClock /> {chapter?.duration}</p>
                            </div>
                        </div>
                        <HiOutlineCheckCircle className='text-4xl text-gray-300 flex-none' />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChapterList
