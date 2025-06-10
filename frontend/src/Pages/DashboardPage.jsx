import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import Dashboard from "../Components/Dashboard/Page"

const DashboardPage = () => {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />  
      </SignedOut>
    </>
  )
}

export default DashboardPage
