import { apiSlice } from './apiSlice.js';

export const flashcardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create flashcard set
    createFlashcardSet: builder.mutation({
      query: (flashcardData) => ({
        url: '/api/flashcard/create',
        method: 'POST',
        body: flashcardData,
      }),
      invalidatesTags: ['Flashcard'],
    }),

    // Get flashcard sets by course ID
    getFlashcardSetsByCourse: builder.query({
      query: (courseId) => `/api/flashcard/course/${courseId}`,
      providesTags: ['Flashcard'],
    }),

    // Get specific flashcard set by ID
    getFlashcardSetById: builder.query({
      query: (setId) => `/api/flashcard/${setId}`,
      providesTags: ['Flashcard'],
    }),

    // Update flashcard set
    updateFlashcardSet: builder.mutation({
      query: ({ setId, ...data }) => ({
        url: `/api/flashcard/${setId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Flashcard'],
    }),

    // Delete flashcard set
    deleteFlashcardSet: builder.mutation({
      query: (setId) => ({
        url: `/api/flashcard/${setId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Flashcard'],
    }),

    // Add flashcard to set
    addFlashcard: builder.mutation({
      query: ({ setId, ...cardData }) => ({
        url: `/api/flashcard/${setId}/flashcard`,
        method: 'POST',
        body: cardData,
      }),
      invalidatesTags: ['Flashcard'],
    }),

    // Remove flashcard from set
    removeFlashcard: builder.mutation({
      query: ({ setId, cardId }) => ({
        url: `/api/flashcard/${setId}/flashcard/${cardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Flashcard'],
    }),
  }),
});

export const {
  useCreateFlashcardSetMutation,
  useGetFlashcardSetsByCourseQuery,
  useGetFlashcardSetByIdQuery,
  useUpdateFlashcardSetMutation,
  useDeleteFlashcardSetMutation,
  useAddFlashcardMutation,
  useRemoveFlashcardMutation,
} = flashcardSlice;
