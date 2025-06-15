# Redux Setup for Course Creation

This document explains how Redux is used for state management in the CourseMint application.

## Overview

We've implemented Redux to maintain state efficiently across components, particularly for the course creation flow. This centralizes state management and makes it easy to access and update the application state from any component.

## Redux Structure

### Store

The Redux store is configured in `src/redux/store.js`:

```js
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';

export const store = configureStore({
  reducer: {
    course: courseReducer,
    // Add other reducers here as needed
  }
});
```

### Slice

The course slice is defined in `src/redux/courseSlice.js` and includes:
- Initial state
- Reducers for updating the state
- Action creators exported from the slice

```js
// Key action creators
export const { 
  setCourseCategory, 
  setCourseTitle, 
  setCourseDescription,
  updateSelectedOption,
  nextStep,
  prevStep,
  resetForm
} = courseSlice.actions;
```

## How to Use Redux in Components

### 1. Accessing State in a Component

```jsx
import { useSelector } from 'react-redux';

const MyComponent = () => {
  // Destructure only what you need from the state
  const { courseCategory, activeStep } = useSelector(state => state.course);
  
  // Now you can use these values
  return (
    <div>
      <h2>Current category: {courseCategory || 'None selected'}</h2>
      <p>Step: {activeStep}</p>
    </div>
  );
};
```

### 2. Updating State in a Component

```jsx
import { useDispatch } from 'react-redux';
import { setCourseCategory, nextStep } from '../../redux/courseSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const handleCategorySelect = (category) => {
    dispatch(setCourseCategory(category));
  };
  
  const handleNext = () => {
    dispatch(nextStep());
  };
  
  return (
    <div>
      <button onClick={() => handleCategorySelect('Programming')}>
        Select Programming
      </button>
      <button onClick={handleNext}>
        Next Step
      </button>
    </div>
  );
};
```

### 3. Updating Complex State

For complex objects like `selectedOptions`, use the `updateSelectedOption` action:

```jsx
import { useDispatch } from 'react-redux';
import { updateSelectedOption } from '../../redux/courseSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const handleDifficultyChange = (difficulty) => {
    dispatch(updateSelectedOption({ key: 'difficulty', value: difficulty }));
  };
  
  return (
    <select onChange={(e) => handleDifficultyChange(e.target.value)}>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  );
};
```

## Benefits of Using Redux

1. **State Persistence**: Form data persists between steps even if the user navigates back and forth
2. **Single Source of Truth**: All state is maintained in a single store
3. **Centralized Logic**: State updates are handled in reducers, keeping component logic clean
4. **Debugging**: Redux DevTools can be used to track state changes
5. **Easy to Extend**: Adding new state just requires updating the slice

## Structure

- `redux/store.js`: Creates and configures the Redux store
- `redux/courseSlice.js`: Defines the course state and reducers
- Components access state with `useSelector` and update with `useDispatch`

For more information, refer to the Redux documentation:
[Redux Toolkit](https://redux-toolkit.js.org/)
