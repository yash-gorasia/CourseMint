import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import courseInputReducer  from "./feature/courseInputSlice.js";
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        courseInput: courseInputReducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),

    devTools: true,
})

setupListeners(store.dispatch);
export default store;
