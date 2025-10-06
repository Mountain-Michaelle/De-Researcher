import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { shortenAddress } from "../../_lib/addresShortener";
import { initProvider } from "../../_lib/utils/wallet";
import EthereumProvider from "@walletconnect/ethereum-provider";

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
  const e = error as any;
  return {
    name: e?.name || "Error",
    message: e?.message || "Unknown error",
    stack: e?.stack,
    code: e?.code || null,
  };
};

// 🪙 Connect wallet (Desktop MetaMask + Mobile via WalletConnect)
export const connectWallet = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string | SerializedError }
>("wallet/connectWallet", async (_, thunkAPI) => {
  try {
    let provider: ethers.BrowserProvider | null = null;
    let accounts: string[] = [];

    // Check for MetaMask (Desktop)
    if (typeof window !== "undefined" && (window as any).ethereum) {
      provider = initProvider();
      if (!provider) throw new Error("Provider initialization failed");
      accounts = await provider.send("eth_requestAccounts", []);
    } else {
      // Fallback to WalletConnect (Mobile)
      const wcProvider = await EthereumProvider.init({
        projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // 🔑 get from cloud.walletconnect.com
        showQrModal: true,
        chains: [1], // Ethereum Mainnet (adjust for testnets)
      });

      await wcProvider.enable();

      provider = new ethers.BrowserProvider(wcProvider as any);

    const signers = await provider?.listAccounts();
    accounts = await Promise.all(signers?.map((s) => s.getAddress()));
    }

    if (!accounts || accounts.length === 0) {
      return thunkAPI.rejectWithValue("No account found");
    }

    const address = accounts[0];
    return {
      address,
      shortAddress: shortenAddress(address),
      isConnected: true,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(serializeError(error));
  }
});

// 🔄 Check wallet connection
export const checkWalletConnection = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string | SerializedError }
>("wallet/checkWalletConnection", async (_, thunkAPI) => {
  try {
    let provider: ethers.BrowserProvider | null = null;

    if (typeof window !== "undefined" && (window as any).ethereum) {
      provider = initProvider();
    } else {
      // No MetaMask injected provider
      return thunkAPI.rejectWithValue("Wallet not connected");
    }

    const accounts: string[] = await provider?.send("eth_requestAccounts", []);
    if (!accounts || accounts.length === 0) {
      return thunkAPI.rejectWithValue("No connected account");
    }

    const address = accounts[0];
    return {
      address,
      shortAddress: shortenAddress(address),
      isConnected: true,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(serializeError(error));
  }
});

// 🔌 Disconnect wallet
export const disconnectWallet = createAsyncThunk<null, void>(
  "wallet/disconnectWallet",
  async () => {
    try {
      // Optional: Add WalletConnect disconnect logic
      if ((window as any).walletConnectProvider) {
        await (window as any).walletConnectProvider.disconnect();
      }
    } catch (e) {
      console.error("Disconnect error:", e);
    }
    return null;
  }
);
