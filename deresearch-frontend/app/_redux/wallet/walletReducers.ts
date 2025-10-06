// src/redux/wallet/walletSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  connectWallet,
  checkWalletConnection,
  disconnectWallet,
} from "./walletActions";

export interface WalletState {
  loading: boolean;
  address: string | null;
  shortAddress: string | null;
  isConnected: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

//
// 🪣 Initial state with correct types
//
const initialState: WalletState = {
  loading: false,
  address: null,
  shortAddress: null,
  isConnected: false,
  status: "idle",
  error: null,
};

//
//
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    resetState(state) {
      state.error = null;
      state.loading = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect wallet
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address;
        state.shortAddress = action.payload.shortAddress;
        state.isConnected = action.payload.isConnected;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error =
          (action.payload as string) || action.error.message || "Wallet error";
        state.isConnected = false;
      })

      // Check wallet connection
      .addCase(checkWalletConnection.pending, (state) => {
        state.loading = false;
      })
      .addCase(checkWalletConnection.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.status = "succeeded";
          state.address = action.payload.address;
          state.shortAddress = action.payload.shortAddress;
          state.isConnected = action.payload.isConnected;
        } else {
          state.status = "failed";
          state.address = null;
          state.shortAddress = null;
          state.isConnected = false;
        }
      })
      .addCase(checkWalletConnection.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Wallet check failed";
      })

      // Disconnect wallet
      .addCase(disconnectWallet.fulfilled, () => initialState);
  },
});

//
// 🧾 Exports
//
export const { resetState } = walletSlice.actions;
export default walletSlice.reducer;
