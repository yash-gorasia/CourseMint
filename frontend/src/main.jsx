import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import SignUpPage from './Pages/SignUpPage.jsx'
import SignInPage from './Pages/SignInPage.jsx'
import DashboardPage from './Pages/DashboardPage.jsx'
import CreateCoursePage from './Pages/CreateCoursePage.jsx'
import CoursePage from './Pages/CoursePage.jsx'
import StudyPage from './Pages/StudyPage.jsx'
import { Provider } from 'react-redux'
import  store  from './redux/store'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" signInUrl='/sign-in' signUpUrl='/sign-up'>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-course" element={<CreateCoursePage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/study/:courseId" element={<StudyPage />} />
          </Routes>
        </Router>
      </ClerkProvider>
    </Provider>
  </StrictMode>,
)
