import { shortenAddress } from "../../_lib/addresShortener";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { initProvider } from "../../_lib/utils/wallet";
import { BrowserProvider } from "ethers"; 

export interface WalletInfo {
  address: string;
  shortAddress: string;
  isConnected: boolean;
}

export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  code?: string | null;
}

const serializeError = (error: unknown): SerializedError => {
  const err = error as Record<string, unknown>;
  return {
    name: (err?.name as string) || "Error",
    message: (err?.message as string) || "Unknown error",
    stack: err?.stack as string | undefined,
    code: (err?.code as string) || null,
  };
};

// Connect wallet
export const connectWallet = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: SerializedError | string }
>(
  "wallet/connectWallet",
  async (_, thunkAPI) => {
    if (typeof window === "undefined" || !window.ethereum) {
      return thunkAPI.rejectWithValue("MetaMask not installed");
    }

    try {
      const provider = new BrowserProvider(window.ethereum); 
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length === 0) {
        return thunkAPI.rejectWithValue("No account found");
      }

      const address = accounts[0];
      return {
        address,
        shortAddress: shortenAddress(address),
        isConnected: true,
      };
    } catch (error) {
      console.log("Errors ", error)
      return thunkAPI.rejectWithValue(serializeError(error));
    }
  }
);

// 🔄 5. Check wallet connection on refresh
export const checkWalletConnection = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: SerializedError | string }
>(
  "wallet/checkWalletConnection",
  async (_, thunkAPI) => {
    if (typeof window === "undefined" || !window.ethereum) {
      return thunkAPI.rejectWithValue("MetaMask not installed");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        return thunkAPI.rejectWithValue("No connected account");
      }

      const address = accounts[0].address; 
      return {
        address,
        shortAddress: shortenAddress(address),
        isConnected: true,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(serializeError(error));
    }
  }
);

// Disconnect wallet (clear Redux state)
export const disconnectWallet = createAsyncThunk<null, void>(
  "wallet/disconnectWallet",
  async () => null
);
