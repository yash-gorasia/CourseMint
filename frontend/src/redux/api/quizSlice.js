import { apiSlice } from './apiSlice.js';

export const quizApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new quiz
    createQuiz: builder.mutation({
      query: (quizData) => ({
        url: '/api/quiz',
        method: 'POST',
        body: quizData,
      }),
      invalidatesTags: ['Quiz'],
    }),

    // Get all quizzes for a course
    getQuizzesByCourse: builder.query({
      query: (courseId) => `/api/quiz/course/${courseId}`,
      providesTags: ['Quiz'],
    }),

    // Get a specific quiz by ID
    getQuizById: builder.query({
      query: (quizId) => `/api/quiz/${quizId}`,
      providesTags: ['Quiz'],
    }),

    // Update a quiz
    updateQuiz: builder.mutation({
      query: ({ quizId, ...updates }) => ({
        url: `/api/quiz/${quizId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Quiz'],
    }),

    // Delete a quiz
    deleteQuiz: builder.mutation({
      query: (quizId) => ({
        url: `/api/quiz/${quizId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quiz'],
    }),
  }),
});

export const {
  useCreateQuizMutation,
  useGetQuizzesByCourseQuery,
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = quizApiSlice;
