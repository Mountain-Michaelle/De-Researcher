// src/redux/projects/projectReducer.js
import { createSlice } from "@reduxjs/toolkit";
import {createProject, fetchMyProjects, fetchAllProjects} from "./projectActions";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    myProjects: [],
    allProjects: [],
    loading: false,
    success: false,
    error: null,
  },

reducers: {
        resetStatus(state) {
        state.success = false,     
        state.error = null
        },
    },

  extraReducers: (builder) => {
    builder
      // Fetch projects
  // Fetch My Projects
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.myProjects = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.allProjects = action.payload;
        state.error = null;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


     // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createProject.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

  },
});

export const {resetStatus} = projectSlice.actions
export default projectSlice.reducer;
 