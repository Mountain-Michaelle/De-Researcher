"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { connectWallet } from "@/app/_lib/utils/wallet";
import { serializeBigNumbers } from "@/app/_lib/utils/serializeBigNumbers";



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
  data?: string;
}

interface WalletConnection {
  contractInstance: any;
  address: string;
}

interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  code?: string | null;
}


export const fetchMyProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: SerializedError }
>("projects/fetchMyProjects", async (_, thunkAPI) => {
  try {
    const { contractInstance, address }: WalletConnection = await connectWallet();
    const proj = await contractInstance.getProjectsByCreator(address);

    if (!Array.isArray(proj) || proj.length === 0) return [];

    const formattedData: Project[] = proj.map((entry: any) => {
      const safeEntry = serializeBigNumbers(entry);

      return {
        title: safeEntry[0],
        description: safeEntry[1],
        amount: Number(safeEntry[2] || 0),
        creator: safeEntry[3],
        stake: safeEntry[2]?.toString(),
        transactionHash: safeEntry[4],
        recipient: safeEntry[5],
        projectId: safeEntry[6]?.toString(),
        metadata: safeEntry[6]?.toString(),
      };
    });

    return formattedData;
  } catch (error: any) {
    const serializedError: SerializedError = {
      name: error.name || "FetchMyProjectsError",
      message: error.message || "Failed to fetch projects",
      stack: error.stack,
      code: error.code || null,
    };
    return thunkAPI.rejectWithValue(serializedError);
  }
});



export const fetchAllProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: SerializedError }
>("projects/fetchAllProjects", async (_, thunkAPI) => {
  try {
    const { contractInstance }: WalletConnection = await connectWallet();
    const proj = await contractInstance.getAllProjects();

    if (!proj || !Array.isArray(proj[0]) || proj[0].length === 0) return [];

    const cleanData: Project[] = proj[0].map((item: any) => {
      const safeItem = serializeBigNumbers(item);

      return {
        title: safeItem[0],
        description: safeItem[1],
        stake: safeItem[2]?.toString(),
        creator: safeItem[3],
        contributors: safeItem[4],
        investor: safeItem[5],
        projectId: safeItem[6]?.toString(),
      };
    });

    return cleanData.slice(-4).reverse();
  } catch (error: any) {
    const serializedError: SerializedError = {
      name: error.name || "FetchAllProjectsError",
      message: error.message || "Failed to fetch all projects",
      stack: error.stack,
      code: error.code || null,
    };
    return thunkAPI.rejectWithValue(serializedError);
  }
});



export const createProject = createAsyncThunk<
  void,
  { title: string; description: string; stake: string },
  { rejectValue: SerializedError }
>("projects/createProject", async ({ title, description, stake }, thunkAPI) => {
  try {
    const { contractInstance }: WalletConnection = await connectWallet();
    const tx = await contractInstance.createResearchProject(title, description, stake);
    await tx.wait();

    // Refresh data after creation
    thunkAPI.dispatch(fetchMyProjects());
    thunkAPI.dispatch(fetchAllProjects());
  } catch (error: any) {
    const serializedError: SerializedError = {
      name: error.name || "CreateProjectError",
      message: error.message || "Failed to create project",
      stack: error.stack,
      code: error.code || null,
    };
    return thunkAPI.rejectWithValue(serializedError);
  }
});
