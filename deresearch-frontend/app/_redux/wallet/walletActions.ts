import { shortenAddress } from "../../_lib/addresShortener";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { initProvider } from "../../_lib/utils/wallet";
import { ethers } from "ethers";

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

const serializeError = (error: any): SerializedError => ({
  name: error?.name || "Error",
  message: error?.message || "Unknown error",
  stack: error?.stack,
  code: error?.code || null,
});

// 🪙 4. Connect wallet
export const connectWallet = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string | SerializedError }
>(
  "wallet/connectWallet",
  async (_, thunkAPI) => {
    if (typeof window === "undefined" || !window.ethereum) {
      return thunkAPI.rejectWithValue("MetaMask not installed");
    }

    try {
      const provider = initProvider();
      if (!provider) throw new Error("Provider initialization failed");

      const accounts: string[] = await provider.send("eth_requestAccounts", []);
      if (accounts.length === 0) {
        return thunkAPI.rejectWithValue("No account found");
      }

      const address = accounts[0];
      return {
        address,
        shortAddress: shortenAddress(address),
        isConnected: true,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(serializeError(error));
    }
  }
);

// 🔄 5. Check wallet connection on refresh
export const checkWalletConnection = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string | SerializedError }
>(
  "wallet/checkWalletConnection",
  async (_, thunkAPI) => {
    if (typeof window === "undefined" || !window.ethereum) {
      return thunkAPI.rejectWithValue("MetaMask not installed");
    }

    try {
      const provider = initProvider();
      if (!provider) throw new Error("Provider initialization failed");

      const signers = await provider.listAccounts();
      if (signers.length === 0) {
        return thunkAPI.rejectWithValue("No connected account");
      }

      const address = await signers[0].getAddress();
      return {
        address,
        shortAddress: shortenAddress(address),
        isConnected: true,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(serializeError(error));
    }
  }
);

// 🔌 6. Disconnect wallet (just clears Redux state)
export const disconnectWallet = createAsyncThunk<null, void>(
  "wallet/disconnectWallet",
  async () => null
);
