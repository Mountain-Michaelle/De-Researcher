import { shortenAddress } from '../../_lib/addresShortener';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { initProvider } from "../../_lib/utils/wallet";

// 🧠 1. Define wallet data shape
export interface WalletInfo {
  address: string;
  shortAddress: string;
  isConnected: boolean;
}

// 🧱 2. Define reject value type
interface RejectValue {
  message: string;
}

// 🪙 3. Connect wallet
export const connectWallet = createAsyncThunk<
  WalletInfo, // return type when fulfilled
  void,       // argument type (none)
  { rejectValue: string } // reject value type
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
      return thunkAPI.rejectWithValue(error?.message ?? "Failed to connect wallet");
    }
  }
);

// 🔄 4. Check wallet connection on refresh
export const checkWalletConnection = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string }
>(
  "wallet/checkWalletConnection",
  async (_, thunkAPI) => {
    if (typeof window === "undefined" || !window.ethereum) {
      return thunkAPI.rejectWithValue("MetaMask not installed");
    }

    try {
      const provider = initProvider();
      if (!provider) throw new Error("Provider initialization failed");
        const signers = await provider.listAccounts(); // type: JsonRpcSigner[]
    //   const accounts: string[] = await provider.listAccounts();
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
      return thunkAPI.rejectWithValue(error?.message ?? "Failed to check connection");
    }
  }
);

// 🔌 5. Disconnect wallet (just clears Redux state)
export const disconnectWallet = createAsyncThunk<null, void>(
  "wallet/disconnectWallet",
  async () => null
);
