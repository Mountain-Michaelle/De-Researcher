"use client"
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { connectWallet } from "@/app/_lib/utils/wallet";

export interface Project {
  title: string;
  description: string;
  amount?: number;
  creator: string;
  stake: string;
  transactionHash?: string;
  recipient?: string;
  projectId: string;
  metadata?: string;
  investor?: string;
  contributors?: string;
  data?:string;
}



interface WalletConnection {
  contractInstance: any; 
  address: string;
}



// Fetch projects created by current user
export const fetchMyProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  "projects/fetchMyProjects",
  async (_, thunkAPI) => {
    try {
      const { contractInstance, address }: WalletConnection = await connectWallet();
      const proj = await contractInstance.getProjectsByCreator(address);

      if (!Array.isArray(proj) || proj.length === 0) return [];

      const formattedData: Project[] = proj.map((entry: any) => ({
        title: entry[0],
        description: entry[1],
        amount: parseInt(entry[2]?.hex ?? "0", 16),
        creator: entry[3],
        stake: BigNumber.from(entry[2]).toString(),
        transactionHash: entry[4],
        recipient: entry[5],
        projectId: BigNumber.from(entry[6]).toString(),
        metadata: entry[6],
      }));

      return formattedData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? "Failed to fetch my projects");
    }
  }
);

//Fetch all projects
export const fetchAllProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  "projects/fetchAllProjects",
  async (_, thunkAPI) => {
    try {
      const { contractInstance }: WalletConnection = await connectWallet();
      const proj = await contractInstance.getAllProjects();

      if (!proj || !Array.isArray(proj[0]) || proj[0].length === 0) return [];

      const cleanData: Project[] = proj[0].map((item: any) => ({
        title: item[0],
        description: item[1],
        stake: BigNumber.from(item[2] ?? 0).toString(),
        creator: item[3],
        contributors: item[4],
        investor: item[5],
        projectId: BigNumber.from(item[6] ?? 0).toString(),
      }));

      // Return last 4 projects, reversed
      return cleanData.slice(-4).reverse();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? "Failed to fetch all projects");
    }
  }
);

// Create new project
export const createProject = createAsyncThunk<
  void, // Return type
  { title: string; description: string; stake: string }, // Args type
  { rejectValue: string }
>(
  "projects/createProject",
  async ({ title, description, stake }, thunkAPI) => {
    try {
      const { contractInstance }: WalletConnection = await connectWallet();
      const tx = await contractInstance.createResearchProject(title, description, stake);
      await tx.wait();

      // Re-fetch data after success
      thunkAPI.dispatch(fetchMyProjects());
      thunkAPI.dispatch(fetchAllProjects());
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message ?? "Failed to create project");
    }
  }
);
