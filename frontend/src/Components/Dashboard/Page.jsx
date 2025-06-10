import React from 'react'
import SideBar from './SideBar'
import Header from './Header'
import AddCourse from './AddCourse'


const Dashboard = () => {
  return (
    <>
      <div className='md:w-64 hidden md:block'>
        <SideBar />
      </div>
      <div className='md:ml-64'>
        <Header />
      </div>
      <div className='md:ml-64'>
        <AddCourse />
      </div>
    </>
  )
}

export default Dashboard
