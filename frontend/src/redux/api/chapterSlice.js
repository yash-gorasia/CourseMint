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
    }),
});

export const { useAddChapterMutation } = chapterApiSlice;