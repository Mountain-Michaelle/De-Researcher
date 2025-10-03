// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projects/projectReducers";
import walletReducer from "./wallet/walletReducers";

const store = configureStore({
  reducer: {
    projects: projectReducer,
    wallet: walletReducer,
  },
});

export default store;
