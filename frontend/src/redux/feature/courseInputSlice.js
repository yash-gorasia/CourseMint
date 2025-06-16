import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courseCategory: null,
  courseTitle: '',
  courseDescription: '',
  selectedOptions: {
    difficulty: null,
    duration: null,
    includeVideo: null,
    chapters: ''
  },
  activeStep: 1
};

export const courseInputSlice = createSlice({
  name: 'courseInput',
  initialState,
  reducers: {
    setCourseCategory: (state, action) => {
      state.courseCategory = action.payload;
    },
    setCourseTitle: (state, action) => {
      state.courseTitle = action.payload;
    },
    setCourseDescription: (state, action) => {
      state.courseDescription = action.payload;
    },
    setSelectedOption: (state, action) => {
      const { key, value } = action.payload;
      state.selectedOptions[key] = value;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    nextStep: (state) => {
      state.activeStep = Math.min(state.activeStep + 1, 3);
    },
    prevStep: (state) => {
      state.activeStep = Math.max(state.activeStep - 1, 1);
    },
  }
});

export const { 
  setCourseCategory, 
  setCourseTitle, 
  setCourseDescription, 
  setSelectedOption, 
  setActiveStep,
  nextStep,
  prevStep,
} = courseInputSlice.actions;

export default courseInputSlice.reducer;
