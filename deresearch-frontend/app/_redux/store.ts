"use client"
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projects/projectReducers";
import walletReducer from "./wallet/walletReducers";

// Create the store
export const store = configureStore({
  reducer: {
    projects: projectReducer,
    wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
