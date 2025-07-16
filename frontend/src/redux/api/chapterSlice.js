import { apiSlice } from "./apiSlice";
import { CHAPTER_URL } from "../constants";

// Data transformation utilities for chapters
const normalizeChapterContent = (content) => {
  if (!content) return [];
  
  // If content is already an array, normalize each item
  if (Array.isArray(content)) {
    return content.map(topic => ({
      title: topic.title || topic.name || 'Untitled Topic',
      description: topic.description || topic.desc || '',
      codeExample: topic.codeExample || topic.code_example || topic.code || null,
      subFeatures: (topic.subFeatures || topic.sub_features || topic.subFeartures || []).map(sub => ({
        title: sub.title || sub.name || 'Untitled Sub-topic',
        description: sub.description || sub.desc || '',
        codeExample: sub.codeExample || sub.code_example || sub.code || null
      }))
    }));
  }
  
  // If content has a topics property
  if (content.topics && Array.isArray(content.topics)) {
    return normalizeChapterContent(content.topics);
  }
  
  // If content is a single object, wrap in array
  if (typeof content === 'object') {
    return normalizeChapterContent([content]);
  }
  
  return [];
};

const normalizeChapterData = (chapterData) => {
  if (!chapterData) return null;
  
  return {
    ...chapterData,
    content: normalizeChapterContent(chapterData.content)
  };
};

const validateChapterPayload = (chapter) => {
  const errors = [];
  
  if (!chapter.courseId || chapter.courseId.trim().length === 0) {
    errors.push('Course ID is required');
  }
  
  if (!chapter.content) {
    errors.push('Chapter content is required');
  }
  
  if (!chapter.videoId) {
    chapter.videoId = null; // Set default if not provided
  }
  
  if (errors.length > 0) {
    throw new Error(`Chapter validation failed: ${errors.join(', ')}`);
  }
  
  return {
    ...chapter,
    courseId: chapter.courseId.trim(),
    content: normalizeChapterContent(chapter.content),
    videoId: chapter.videoId || null
  };
};

export const chapterApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addChapter: builder.mutation({
            query: (chapter) => {
                const validatedChapter = validateChapterPayload(chapter);
                return {
                    url: `${CHAPTER_URL}/create-chapter`,
                    method: "POST",
                    body: validatedChapter,
                };
            },
            transformResponse: (response) => {
                console.log('Chapter creation response:', response);
                return response;
            },
            transformErrorResponse: (response) => {
                console.error('Chapter creation error:', response);
                return {
                    status: response.status,
                    message: response.data?.message || 'Failed to create chapter'
                };
            },
            invalidatesTags: ["Chapter"],
        }),
        
        getChapter: builder.query({
            query: (chapterId) => ({
                url: `${CHAPTER_URL}/get-chapter/${chapterId}`,
                method: "GET"
            }),
            transformResponse: (response) => {
                console.log('Raw chapter data:', response);
                const normalizedData = {
                    ...response,
                    chapter: normalizeChapterData(response.chapter)
                };
                console.log('Normalized chapter data:', normalizedData);
                return normalizedData;
            },
            transformErrorResponse: (response) => {
                console.error('Get chapter error:', response);
                return {
                    status: response.status,
                    message: response.data?.message || 'Failed to fetch chapter'
                };
            },
            providesTags: ["Chapter"],
        }),

        getChaptersByCourseId: builder.query({
            query: (courseId) => ({
                url: `${CHAPTER_URL}/get-chapters/${courseId}`,
                method: "GET"
            }),
            transformResponse: (response) => {
                console.log('Raw chapters data:', response);
                if (response.chapters && Array.isArray(response.chapters)) {
                    const normalizedChapters = response.chapters.map(chapter => normalizeChapterData(chapter));
                    return {
                        ...response,
                        chapters: normalizedChapters
                    };
                }
                return response;
            },
            transformErrorResponse: (response) => {
                console.error('Get chapters error:', response);
                return {
                    status: response.status,
                    message: response.data?.message || 'Failed to fetch chapters'
                };
            },
            providesTags: ["Chapter"],
        })
    
    }),
});

export const { 
    useAddChapterMutation, 
    useGetChapterQuery, 
    useGetChaptersByCourseIdQuery
} = chapterApiSlice;