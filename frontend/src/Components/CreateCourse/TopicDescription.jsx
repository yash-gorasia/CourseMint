import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCourseTitle, setCourseDescription } from '../../redux/feature/courseInputSlice'

const TopicDescription = () => {
    const dispatch = useDispatch();
    const { courseTitle, courseDescription } = useSelector(state => state.courseInput);
    return (
        <div className="flex flex-col mx-4 sm:mx-16 md:mx-32 lg:mx-56 gap-2">
            {/* Input Topic */}
            <div className="mt-5">
                <label className="font-semibold">
                    Write the topic for which you want to generate the course (e.g., sql, git, heart, land ownership, etc.):
                </label>
                <input
                    type="text"
                    placeholder="Topic"
                    className="block border rounded-md py-1 px-2 w-full"                    value={courseTitle}
                    onChange={(e) => dispatch(setCourseTitle(e.target.value))}
                />
            </div>
            {/* Topic Desc */}
            <div className="flex flex-col mt-5">
                <label className="font-semibold">Tell us more about the course (Optional)</label>                <textarea
                    className="border rounded-md w-full px-2 py-1"
                    placeholder="About your course"                    value={courseDescription}
                    onChange={(e) => dispatch(setCourseDescription(e.target.value))}
                />
            </div>
        </div>
    )
}

export default TopicDescription



