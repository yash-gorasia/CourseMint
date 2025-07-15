import { SignUp } from "@clerk/clerk-react"
import { HiArrowLeft } from "react-icons/hi2"
import { useNavigate } from "react-router-dom"

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
        <button
          onClick={handleBackToHome}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
        >
          <HiArrowLeft className="text-xl" />
          <span className="font-medium">Back to Home</span>
        </button>
        
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
        />
      </div>
    </>
  )
}

export default SignUpPage
