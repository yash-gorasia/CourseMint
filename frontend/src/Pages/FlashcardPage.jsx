import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFlashcardSetsByCourseQuery } from '../redux/api/flashcardSlice.js';
import Flashcard from '../Components/Flashcard/Flashcard.jsx';
import Header from '../Components/Dashboard/Header.jsx';
import Loader from '../utils/Loader.jsx';

const FlashcardPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyMode, setStudyMode] = useState('sequential'); // sequential, random, review
  const [completedCards, setCompletedCards] = useState(new Set());
  const [reviewCards, setReviewCards] = useState(new Set());
  
  const { data: flashcardResponse, isLoading, isError } = useGetFlashcardSetsByCourseQuery(courseId, {
    skip: !courseId // Skip the query if courseId is undefined
  });
  const flashcardSet = flashcardResponse?.flashcardSets?.[0]; // Get the first flashcard set

  // Debug logging
  useEffect(() => {
    console.log('FlashcardPage - courseId:', courseId);
    console.log('FlashcardPage - flashcardResponse:', flashcardResponse);
    console.log('FlashcardPage - flashcardSet:', flashcardSet);
    console.log('FlashcardPage - isLoading:', isLoading);
    console.log('FlashcardPage - isError:', isError);
  }, [courseId, flashcardResponse, flashcardSet, isLoading, isError]);

  useEffect(() => {
    if (studyMode === 'random' && flashcardSet?.flashcards?.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * flashcardSet.flashcards.length));
    }
  }, [studyMode, flashcardSet]);

  const handleNext = () => {
    if (!flashcardSet?.flashcards) return;
    
    if (studyMode === 'random') {
      setCurrentIndex(Math.floor(Math.random() * flashcardSet.flashcards.length));
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, flashcardSet.flashcards.length - 1));
    }
  };

  const handlePrevious = () => {
    if (studyMode === 'random') {
      setCurrentIndex(Math.floor(Math.random() * flashcardSet.flashcards.length));
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleMarkForReview = () => {
    const newReviewCards = new Set(reviewCards);
    if (reviewCards.has(currentIndex)) {
      newReviewCards.delete(currentIndex);
    } else {
      newReviewCards.add(currentIndex);
    }
    setReviewCards(newReviewCards);
  };

  const handleMarkCompleted = () => {
    const newCompletedCards = new Set(completedCards);
    if (completedCards.has(currentIndex)) {
      newCompletedCards.delete(currentIndex);
    } else {
      newCompletedCards.add(currentIndex);
    }
    setCompletedCards(newCompletedCards);
  };

  const resetProgress = () => {
    setCompletedCards(new Set());
    setReviewCards(new Set());
    setCurrentIndex(0);
  };

  const goToCard = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      </div>
    );
  }

  if (isError || !flashcardSet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Flashcard Set Not Found</h2>
            <p className="text-gray-600 mb-4">The flashcard set you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcardSet.flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{flashcardSet.title}</h1>
          {flashcardSet.description && (
            <p className="text-gray-600 mb-4">{flashcardSet.description}</p>
          )}
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>{flashcardSet.totalCards} cards</span>
            <span>•</span>
            <span className="capitalize">{flashcardSet.level}</span>
            <span>•</span>
            <span className="capitalize">{flashcardSet.category}</span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Study Mode */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Study Mode:</label>
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sequential">Sequential</option>
                  <option value="random">Random</option>
                  <option value="review">Review Only</option>
                </select>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-green-600">
                  ✓ {completedCards.size} completed
                </span>
                <span className="text-orange-600">
                  ★ {reviewCards.size} for review
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkCompleted}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    completedCards.has(currentIndex)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {completedCards.has(currentIndex) ? 'Completed' : 'Mark Complete'}
                </button>
                <button
                  onClick={handleMarkForReview}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    reviewCards.has(currentIndex)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {reviewCards.has(currentIndex) ? 'In Review' : 'Mark Review'}
                </button>
                <button
                  onClick={resetProgress}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Flashcard Section */}
        {currentCard && (
          <Flashcard
            card={currentCard}
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentIndex={currentIndex}
            totalCards={flashcardSet.flashcards.length}
          />
        )}

        {/* Card Grid Navigation */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {flashcardSet.flashcards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => goToCard(index)}
                  className={`
                    w-10 h-10 rounded-md text-sm font-medium transition-colors
                    ${index === currentIndex 
                      ? 'bg-blue-500 text-white' 
                      : completedCards.has(index)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : reviewCards.has(index)
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
