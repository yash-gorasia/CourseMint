import React from 'react'
import CreateCourse from '../Components/CreateCourse/Page'
import { CourseProvider } from '../context/CourseContext'


const CreateCoursePage = () => {
  return (
    <div>
      <CourseProvider>
        <CreateCourse />
      </CourseProvider>
    </div>
  )
}

export default CreateCoursePage
