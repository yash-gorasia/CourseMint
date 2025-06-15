import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom';

const AddCourse = () => {
    const { user } = useUser();
    return (
        <div className='flex justify-between items-center p-8'>
            <div>
                <h2 className='text-3xl'>Hello, <span className='font-bold'>{user.fullName}</span></h2>
                <p className='text-sm text-gray-500'>Create new course with AI</p>
            </div>
            <Link to="/create-course">
                <button className='inline-block rounded-md border border-green-600 bg-green-500 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-green-700 cursor-pointer'>+ Create AI Course</button>
            </Link>
        </div>
    )
}

export default AddCourse
