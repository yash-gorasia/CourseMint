import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetQuizByIdQuery } from '../redux/api/quizSlice.js'
import Header from '../Components/Dashboard/Header.jsx'
import Loader from '../utils/Loader.jsx'

const QuizPage = () => {
    const { quizId } = useParams()
    const navigate = useNavigate()
    const { data: res, isLoading, isError } = useGetQuizByIdQuery(quizId)
    const quiz = res?.quiz

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [timeLeft, setTimeLeft] = useState(null)
    const [quizStarted, setQuizStarted] = useState(false)

    // Initialize timer when quiz starts
    useEffect(() => {
        if (quizStarted && quiz?.timeLimit && !showResults) {
            setTimeLeft(quiz.timeLimit * 60) // Convert minutes to seconds
        }
    }, [quizStarted, quiz?.timeLimit, showResults])

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && quizStarted && !showResults) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && quizStarted) {
            handleSubmitQuiz()
        }
    }, [timeLeft, quizStarted, showResults])

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }))
    }

    const handleSubmitQuiz = () => {
        setShowResults(true)
        setQuizStarted(false)
    }

    const calculateScore = () => {
        if (!quiz?.questions) return { score: 0, percentage: 0 }

        let correct = 0
        quiz.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++
            }
        })

        const percentage = Math.round((correct / quiz.questions.length) * 100)
        return { score: correct, total: quiz.questions.length, percentage }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const goToQuestion = (questionIndex) => {
        setCurrentQuestion(questionIndex)
    }

    const nextQuestion = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    if (isLoading) {
        return (
            <div>
                <Header />
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 opacity-80">
                    <Loader />
                </div>
            </div>
        )
    }

    if (isError || !quiz) {
        return (
            <div>
                <Header />
                <div className="mt-10 px-7 md:px-20 lg:px-44 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Quiz Not Found</h2>
                    <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    if (!quizStarted && !showResults) {
        return (
            <div>
                <Header />
                <div className="mt-10 px-7 md:px-20 lg:px-44">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h1 className="text-3xl font-bold text-green-800 mb-4">{quiz.title}</h1>
                            <p className="text-gray-600 mb-6">{quiz.description}</p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-800">Questions</h3>
                                    <p className="text-2xl font-bold text-green-600">{quiz.questions?.length || 0}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-800">Time Limit</h3>
                                    <p className="text-2xl font-bold text-green-600">{quiz.timeLimit} mins</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-800">Passing Score</h3>
                                    <p className="text-2xl font-bold text-green-600">{quiz.passingScore}%</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-800">Difficulty</h3>
                                    <p className="text-2xl font-bold text-green-600 capitalize">{quiz.level}</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={() => setQuizStarted(true)}
                                    className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
                                >
                                    Start Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (showResults) {
        const { score, total, percentage } = calculateScore()
        const passed = percentage >= (quiz.passingScore || 70)

        return (
            <div>
                <Header />
                <div className="mt-10 px-7 md:px-20 lg:px-44">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
                            <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
                            <div className={`text-6xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                {percentage}%
                            </div>
                            <p className="text-xl mb-6">
                                You scored {score} out of {total} questions correctly
                            </p>
                            <div className={`inline-block px-6 py-2 rounded-full text-white font-semibold ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
                                {passed ? 'PASSED' : 'FAILED'}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold mb-6">Review Answers</h2>
                            {quiz.questions.map((question, index) => {
                                const userAnswer = selectedAnswers[index]
                                const isCorrect = userAnswer === question.correctAnswer

                                return (
                                    <div key={index} className="mb-8 p-6 border rounded-lg">
                                        <h3 className="font-semibold mb-4">
                                            {index + 1}. {question.question}
                                        </h3>

                                        <div className="space-y-2 mb-4">
                                            {question.options.map((option, optIndex) => {
                                                let className = "p-3 rounded border "
                                                if (optIndex === question.correctAnswer) {
                                                    className += "bg-green-100 border-green-500 text-green-800"
                                                } else if (optIndex === userAnswer && !isCorrect) {
                                                    className += "bg-red-100 border-red-500 text-red-800"
                                                } else {
                                                    className += "bg-gray-50 border-gray-300"
                                                }

                                                return (
                                                    <div key={optIndex} className={className}>
                                                        {option}
                                                        {optIndex === question.correctAnswer && " ✓"}
                                                        {optIndex === userAnswer && optIndex !== question.correctAnswer && " ✗"}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {question.explanation && (
                                            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                                                <p className="font-semibold text-blue-800">Explanation:</p>
                                                <p className="text-blue-700">{question.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            <div className="text-center mt-8">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mr-4"
                                >
                                    Back to Course
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentQuestion(0)
                                        setSelectedAnswers({})
                                        setShowResults(false)
                                        setQuizStarted(false)
                                    }}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Retake Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Quiz in progress
    const question = quiz.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

    return (
        <div>
            <Header />
            <div className="mt-10 px-7 md:px-20 lg:px-44">
                <div className="max-w-4xl mx-auto">
                    {/* Quiz Header */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-green-800">{quiz.title}</h1>
                            {timeLeft !== null && (
                                <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatTime(timeLeft)}
                                </div>
                            )}
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

                        <div className="space-y-3">
                            {question.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                    ${selectedAnswers[currentQuestion] === index
                                            ? 'bg-green-50 border-green-500'
                                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion}`}
                                        value={index}
                                        checked={selectedAnswers[currentQuestion] === index}
                                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                                        className="mr-3"
                                    />
                                    <span className="text-lg">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <button
                                onClick={prevQuestion}
                                disabled={currentQuestion === 0}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 w-full sm:w-auto"
                            >
                                Previous
                            </button>

                            <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto px-2">
                                {quiz.questions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToQuestion(index)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-sm flex-shrink-0
                      ${currentQuestion === index
                                                ? 'bg-green-600 text-white'
                                                : selectedAnswers[index] !== undefined
                                                    ? 'bg-green-200 text-green-800'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            {currentQuestion === quiz.questions.length - 1 ? (
                                <button
                                    onClick={handleSubmitQuiz}
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 w-full sm:w-auto"
                                >
                                    Submit Quiz
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                                >
                                    Next
                                </button>
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Answered: {Object.keys(selectedAnswers).length} / {quiz.questions.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default QuizPage
