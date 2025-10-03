import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { shortenAddress } from "../../walletUtils/addressShortener";
import { initProvider, getSigner, resetWallet } from "../../walletUtils/Wallet";

// Connect wallet
export const connectWallet = createAsyncThunk(
  "wallet/connectWallet",
  async (_, thunkAPI) => {
    if (!window.ethereum) {
      return thunkAPI.rejectWithValue("Please install MetaMask");
    }

    try {
      const provider = initProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      if (accounts.length > 0) {
        return {
          address: accounts[0],
          shortAddress: shortenAddress(accounts[0]),
          isConnected:true
        };
      } else {
        return thunkAPI.rejectWithValue("No account found");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Check wallet connection on refresh
export const checkWalletConnection = createAsyncThunk(
  "wallet/checkWalletConnection",
  async (_, thunkAPI) => {
    try {
      if (!window.ethereum) {
        return thunkAPI.rejectWithValue("MetaMask not installed");
      }
      const provider = initProvider()
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        return {
          address: accounts[0],
          shortAddress: shortenAddress(accounts[0]),
          isConnected:true,
        };
      } else {
        return thunkAPI.rejectWithValue("No connected account");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Disconnect wallet
export const disconnectWallet = createAsyncThunk(
  "wallet/disconnectWallet",
  async () => null
);
