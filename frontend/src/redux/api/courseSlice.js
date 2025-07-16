import { apiSlice } from "./apiSlice";
import { COURSE_URL } from "../constants";

// Data transformation and validation utilities
const normalizeCourseData = (courseData) => {
  if (!courseData) return null;
  
  return {
    ...courseData,
    courseOutput: {
      courseName: courseData.courseOutput?.courseName || courseData.courseOutput?.course_name || 'Untitled Course',
      courseDescription: courseData.courseOutput?.courseDescription || courseData.courseOutput?.course_description || '',
      chapters: (courseData.courseOutput?.chapters || []).map(chapter => ({
        chapterName: chapter.chapterName || chapter.chapter_name || 'Untitled Chapter',
        chapterDescription: chapter.chapterDescription || chapter.chapter_description || '',
        duration: chapter.duration || '30 mins'
      }))
    }
  };
};

const validateCoursePayload = (course) => {
  const errors = [];
  
  if (!course.name || course.name.trim().length === 0) {
    errors.push('Course name is required');
  }
  
  if (!course.category || course.category.trim().length === 0) {
    errors.push('Course category is required');
  }
  
  if (!course.level || course.level.trim().length === 0) {
    errors.push('Course level is required');
  }
  
  if (!course.courseOutput || typeof course.courseOutput !== 'object') {
    errors.push('Course output is required and must be an object');
  }
  
  if (!course.userEmail || course.userEmail.trim().length === 0) {
    errors.push('User email is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  return {
    ...course,
    name: course.name.trim(),
    category: course.category.trim(),
    level: course.level.trim(),
    includeVideo: Boolean(course.includeVideo),
    userEmail: course.userEmail.trim()
  };
};

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCourse: builder.mutation({
      query: (course) => {
        const validatedCourse = validateCoursePayload(course);
        return {
          url: `${COURSE_URL}/create-course`,
          method: "POST",
          body: validatedCourse,
        };
      },
      transformResponse: (response) => {
        console.log('Course creation response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Course creation error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to create course'
        };
      },
      invalidatesTags: ["Course"],
    }),

    getCourse: builder.query({
      query: (id) => ({
        url: `${COURSE_URL}/get-course/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log('Raw course data:', response);
        const normalizedData = {
          ...response,
          course: normalizeCourseData(response.course)
        };
        console.log('Normalized course data:', normalizedData);
        return normalizedData;
      },
      transformErrorResponse: (response) => {
        console.error('Get course error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to fetch course'
        };
      },
    }),
    
    getCourseByUserEmail: builder.query({
      query: (userEmail) => ({
        url: `${COURSE_URL}/get-course-email`,
        method: "POST",
        body: { userEmail },
      }),
      transformResponse: (response) => {
        console.log('Raw courses by email data:', response);
        if (response.courses && Array.isArray(response.courses)) {
          const normalizedCourses = response.courses.map(course => normalizeCourseData(course));
          return {
            ...response,
            courses: normalizedCourses
          };
        }
        return response;
      },
      invalidatesTags: ["Course"],
    }),
    
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${COURSE_URL}/delete-course`,
        method: "DELETE",
        body: { courseId },
      }),
      transformErrorResponse: (response) => {
        console.error('Delete course error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to delete course'
        };
      },
      invalidatesTags: ["Course"],
    })
  }),
});

export const { 
  useAddCourseMutation, 
  useGetCourseQuery, 
  useGetCourseByUserEmailQuery, 
  useDeleteCourseMutation 
} = courseApiSlice;