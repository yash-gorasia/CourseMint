import { apiSlice } from "./apiSlice";
import { CHAPTER_URL } from "../constants";

export const chapterApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addChapter: builder.mutation({
            query: (chapter) => ({
                url: `${CHAPTER_URL}/create-chapter`,
                method: "POST",
                body: chapter,
            }),
            invalidatesTags: ["Chapter"],
        }),
        
        getChapter: builder.query({
            query: (chapterId) => ({
                url: `${CHAPTER_URL}/get-chapter/${chapterId}`,
                method: "GET"
            }),
            providesTags: ["Chapter"],
        }),

        getChaptersByCourseId: builder.query({
            query: (courseId) => ({
                url: `${CHAPTER_URL}/get-chapters/${courseId}`,
                method: "GET"
            }),
            providesTags: ["Chapter"],
        })
    
    }),
});

export const { 
    useAddChapterMutation, 
    useGetChapterQuery, 
    useGetChaptersByCourseIdQuery
} = chapterApiSlice;