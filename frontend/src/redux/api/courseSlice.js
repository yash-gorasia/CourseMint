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

    getCourse: builder.query({
      query: (id) => ({
        url: `${COURSE_URL}/get-course/${id}`,
        method: "GET",
      }),
    }),
    getCourseByUserEmail: builder.query({
      query: (userEmail) => ({
        url: `${COURSE_URL}/get-course-email`,
        method: "POST",
        body: { userEmail },
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${COURSE_URL}/delete-course`,
        method: "DELETE",
        body: { courseId },
      }),
      invalidatesTags: ["Course"],
    })
  }),
});

export const { useAddCourseMutation, useGetCourseQuery, useGetCourseByUserEmailQuery, useDeleteCourseMutation } = courseApiSlice;