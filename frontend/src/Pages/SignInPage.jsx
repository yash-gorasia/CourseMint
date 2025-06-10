import { SignIn } from "@clerk/clerk-react"

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"   
    />
    </div>
  )
}

export default SignInPage
