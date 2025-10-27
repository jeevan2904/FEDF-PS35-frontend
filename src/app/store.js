import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectReducer from "./projectSlice";
import assignmentReducer from "./assignmentSlice";
import groupReducer from "./groupSlice";
import taskReducer from "./taskSlice";
import milestoneReducer from "./milestoneSlice";
import submissionReducer from "./submissionSlice";
import notificationReducer from "./notificationSlice";
import commentReducer from "./commentSlice";
import analyticsReducer from "./analyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    assignments: assignmentReducer,
    groups: groupReducer,
    tasks: taskReducer,
    milestones: milestoneReducer,
    submissions: submissionReducer,
    notifications: notificationReducer,
    comments: commentReducer,
    analytics: analyticsReducer,
  },
});
