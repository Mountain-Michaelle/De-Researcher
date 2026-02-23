import { createAsyncThunk } from "@reduxjs/toolkit";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { shortenAddress } from "../../_lib/addresShortener";
import { initProvider } from "../../_lib/utils/wallet";
import EthereumProvider from "@walletconnect/ethereum-provider";
import type { MetaMaskInpageProvider } from '@metamask/providers';


// -------------------- INTERFACES --------------------

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

  
// Custom window interface for type-safe external providers
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    walletConnectProvider?: EthereumProvider;
  }
}

const serializeError = (error: unknown): SerializedError => {
  if (error instanceof Error) {
    // Native Error object
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as { code?: string }).code ?? null,
    };
  }
  // Unknown object fallback
  const e = error as Record<string, unknown>;
  return {
    name: typeof e.name === "string" ? e.name : "Error",
    message: typeof e.message === "string" ? e.message : "Unknown error",
    stack: typeof e.stack === "string" ? e.stack : undefined,
    code: typeof e.code === "string" ? e.code : null,
  };
};

// -------------------- CONNECT WALLET --------------------

export const connectWallet = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string | SerializedError }
>("wallet/connectWallet", async (_, thunkAPI) => {
  try {
    let provider: BrowserProvider | null = null;
    let accounts: string[] = [];

    // 🖥️ Desktop MetaMask
    if (typeof window !== "undefined" && window.ethereum) {
      provider = initProvider();
      if (!provider) throw new Error("Provider initialization failed");

      accounts = await provider.send("eth_requestAccounts", []);
    } else {
      // 📱 Mobile WalletConnect fallback
      const wcProvider = await EthereumProvider.init({
        projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // from cloud.walletconnect.com
        showQrModal: true,
        chains: [1], // Ethereum Mainnet (adjust for Goerli, Sepolia, etc.)
      });

      await wcProvider.enable();
      window.walletConnectProvider = wcProvider;

      provider = new BrowserProvider(wcProvider as unknown as EthereumProvider);

      const signers: JsonRpcSigner[] = await provider.listAccounts();
      accounts = await Promise.all(signers.map((s) => s.getAddress()));
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

// -------------------- CHECK WALLET CONNECTION --------------------

export const checkWalletConnection = createAsyncThunk<
  WalletInfo,
  void,
  { rejectValue: string | SerializedError }
>("wallet/checkWalletConnection", async (_, thunkAPI) => {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      return thunkAPI.rejectWithValue("Wallet not connected");
    }

    const provider = initProvider();
    if (!provider) {
      return thunkAPI.rejectWithValue("Provider not initialized");
    }

    const accounts: string[] = await provider.send("eth_requestAccounts", []);
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

// -------------------- DISCONNECT WALLET --------------------

export const disconnectWallet = createAsyncThunk<null, void>(
  "wallet/disconnectWallet",
  async () => {
    try {
      if (window.walletConnectProvider) {
        await window.walletConnectProvider.disconnect();
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    }
    return null;
  }
);
