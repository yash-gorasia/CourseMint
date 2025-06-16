import { apiSlice } from "./apiSlice";
import { COURSE_URL } from "../constants";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCourse: builder.mutation({
      query: (course) => ({
        url: `${COURSE_URL}/create-course`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const { useAddCourseMutation } = courseApiSlice;