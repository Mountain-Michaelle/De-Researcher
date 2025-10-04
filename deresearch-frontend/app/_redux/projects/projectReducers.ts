"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createProject, fetchMyProjects, fetchAllProjects } from "./projectActions";

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

export interface ProjectState {
  myProjects: Project[];
  allProjects: Project[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  myProjects: [],
  allProjects: [],
  loading: false,
  success: false,
  error: null,
};

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
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.myProjects = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProjects.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch your projects.";
      })

      //Fetch All Projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.allProjects = action.payload;
        state.error = null;
      })
      .addCase(fetchAllProjects.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch all projects.";
      })

      //Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createProject.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? "Failed to create project.";
      });
  },
});

export const { resetStatus } = projectSlice.actions;
export default projectSlice.reducer;
