import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';

export const store = configureStore({
  reducer: {
    course: courseReducer,
    // Add other reducers here as needed
  }
});

