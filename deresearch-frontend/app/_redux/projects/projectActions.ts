"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { Contract } from "ethers";
import { connectWallet } from "@/app/_lib/utils/wallet";
import {
  serializeBigNumbers,
  type SerializableValue,
} from "@/app/_lib/utils/serializeBigNumbers";


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

export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  code?: string | null;
}

// Define your contract connection result
interface WalletConnection {
  contractInstance: Contract;
  address: string;
}


//Fetch Projects by Creator
export const fetchMyProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: SerializedError }
>("projects/fetchMyProjects", async (_, thunkAPI) => {
  try {
    const { contractInstance, address }: WalletConnection = await connectWallet();
    const proj: unknown = await contractInstance.getProjectsByCreator(address);

    if (!Array.isArray(proj) || proj.length === 0) return [];

    const formattedData: Project[] = (proj as unknown[]).map((entry) => {
      const safeEntry = serializeBigNumbers(entry as SerializableValue) as unknown[];

      return {
        title: String(safeEntry[0]),
        description: String(safeEntry[1]),
        amount: Number(safeEntry[2] ?? 0),
        creator: String(safeEntry[3]),
        stake: String(safeEntry[2]),
        transactionHash: String(safeEntry[4] ?? ""),
        recipient: String(safeEntry[5] ?? ""),
        projectId: String(safeEntry[6] ?? ""),
        metadata: String(safeEntry[6] ?? ""),
      };
    });

    return formattedData;
  } catch (error) {
    const err = error as Error & { code?: string };
    return thunkAPI.rejectWithValue({
      name: err.name || "FetchMyProjectsError",
      message: err.message || "Failed to fetch projects",
      stack: err.stack,
      code: err.code ?? null,
    });
  }
});

//Fetch All Projects
export const fetchAllProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: SerializedError }
>("projects/fetchAllProjects", async (_, thunkAPI) => {
  try {
    const { contractInstance }: WalletConnection = await connectWallet();
    const proj: unknown = await contractInstance.getAllProjects();

    if (!proj || !Array.isArray((proj as unknown[])[0])) return [];

    const cleanData: Project[] = ((proj as unknown[])[0] as unknown[]).map((item) => {
      const safeItem = serializeBigNumbers(item as SerializableValue) as unknown[];

      return {
        title: String(safeItem[0]),
        description: String(safeItem[1]),
        stake: String(safeItem[2]),
        creator: String(safeItem[3]),
        contributors: String(safeItem[4] ?? ""),
        investor: String(safeItem[5] ?? ""),
        projectId: String(safeItem[6] ?? ""),
      };
    });

    return cleanData.slice(-4).reverse();
  } catch (error) {
    const err = error as Error & { code?: string };
    return thunkAPI.rejectWithValue({
      name: err.name || "FetchAllProjectsError",
      message: err.message || "Failed to fetch all projects",
      stack: err.stack,
      code: err.code ?? null,
    });
  }
});

//Create a New Project
export const createProject = createAsyncThunk<
  string,
  { title: string; description: string; stake: string },
  { rejectValue: SerializedError }
>("projects/createProject", async ({ title, description, stake }, thunkAPI) => {
  try {
    const { contractInstance }: WalletConnection = await connectWallet();
    const tx = await contractInstance.createResearchProject(title, description, stake);
    const receipt = await tx.wait();

    let projectId: string | null = null;
    for (const log of receipt.logs || []) {
      try {
        const parsed = contractInstance.interface.parseLog(log);
        if (parsed?.name === "ProjectCreated") {
          projectId = String(parsed.args.projectId);
          break;
        }
      } catch {
        // Ignore logs that do not match the factory interface.
      }
    }

    if (!projectId) {
      const count = await contractInstance.projectCount();
      const numeric = typeof count === "bigint" ? count : BigInt(count);
      projectId =
        numeric > BigInt(0) ? (numeric - BigInt(1)).toString() : "0";
    }

    // Refresh after creation
    thunkAPI.dispatch(fetchMyProjects());
    thunkAPI.dispatch(fetchAllProjects());

    return projectId;
  } catch (error) {
    const err = error as Error & { code?: string };
    return thunkAPI.rejectWithValue({
      name: err.name || "CreateProjectError",
      message: err.message || "Failed to create project",
      stack: err.stack,
      code: err.code ?? null,
    });
  }
});
