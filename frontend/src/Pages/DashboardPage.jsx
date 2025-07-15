import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"

import SideBar from '../Components/Dashboard/SideBar'
import Header from '../Components/Dashboard/Header'
import AddCourse from '../Components/Dashboard/AddCourse'
import GetUserCourses from '../Components/Dashboard/GetUserCourses'

const DashboardPage = () => {
  return (
    <>
      <SignedIn>
        <div className='md:w-64 hidden md:block'>
          <SideBar />
        </div>
        <div className='md:ml-64'>
          <Header />
        </div>
        <div className='md:ml-64'>
          <AddCourse />
        </div>
        <div className='md:ml-64'>
          <GetUserCourses />
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </>
  )
}

export default DashboardPage
