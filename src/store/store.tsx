import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import courseReducer from "./courseSlice";
import notificationReducer from "./notificationSlice";
import feedbackReducer from "./feedbackSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    notifications: notificationReducer,
    feedback: feedbackReducer,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
