"use client";
import { createSlice } from "@reduxjs/toolkit";
import { createProject, fetchMyProjects, fetchAllProjects } from "./projectActions";
import type { SerializedError } from "@reduxjs/toolkit";

// 🧩 1. Define your project type
export interface Project {
  title: string;
  description: string;
  stake: string;
  creator: string;
  projectId?: string;
  amount?: number;
  transactionHash?: string;
  recipient?: string;
  metadata?: string;
  investor?: string;
  contributors?: string;
}

// 🧩 2. Define your state type
export interface ProjectState {
  myProjects: Project[];
  allProjects: Project[];
  loading: boolean;
  success: boolean;
  error: string | null;
  lastCreatedProjectId: string | null;
}

const initialState: ProjectState = {
  myProjects: [],
  allProjects: [],
  loading: false,
  success: false,
  error: null,
  lastCreatedProjectId: null,
};

// 🧩 3. Create the slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    resetStatus(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = (action.payload as SerializedError)?.message ?? "Failed to fetch your projects.";
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
        state.error = (action.payload as SerializedError)?.message ?? "Failed to fetch all projects.";
      })

      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.lastCreatedProjectId = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.lastCreatedProjectId = String(action.payload ?? "");
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as SerializedError)?.message ?? "Failed to create project.";
      });
  },
});

export const { resetStatus } = projectSlice.actions;
export default projectSlice.reducer;
