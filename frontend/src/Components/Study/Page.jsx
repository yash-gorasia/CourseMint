import React from 'react'
import Header from '../Dashboard/Header'
import BasicInfo from '../CourseLayout/BasicInfo'
import { useParams } from 'react-router-dom'
import { useGetCourseQuery } from '../../redux/api/courseSlice.js'
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";


const Page = () => {
    const { courseId } = useParams()
    const { data: res, isLoading, isError } = useGetCourseQuery(courseId)
    const course = res?.course;
    return (
        <div>
            <Header />
            <div className='px-10 md:px-20 lg:px-44 my-7'>
                <h2 className='text-center font-bold text-3xl text-green-400 my-3 '>Your course is Ready</h2>
                <BasicInfo course={course} />
                <h2 className='text-center text-gray-400 p-4 sm:p-6 md:p-3 border border-black rounded-xl shadow-sm mt-5 bg-white max-w-full md:max-w-3xl mx-auto flex flex-row items-center'>
                    <span className='text-black items-start pr-2'>Course URL :</span>
                    {import.meta.env.VITE_HOST_NAME}/course/view/{courseId}
                    <HiOutlineClipboardDocumentCheck className='text-black ml-5 h-5 w-5  cursor-pointer'
                     onClick={async() => await navigator.clipboard.writeText(`${import.meta.env.VITE_HOST_NAME}/course/view/${courseId}`) }/></h2>

            </div>
        </div>
    )
}

export default Page
