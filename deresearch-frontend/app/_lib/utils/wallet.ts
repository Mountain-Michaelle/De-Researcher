"use client";

import { ethers } from "ethers";
import ResearchProjectFactoryABI from "../../truffle_abis/ResearchProjectFactory.json";
import { Buffer } from "buffer";
import type { MetaMaskInpageProvider } from "@metamask/providers";

// ---------------- GLOBAL TYPES ----------------

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    Buffer?: typeof Buffer;
  }
}

// ---------------- INTERFACES ----------------

interface NetworkMapping {
  [networkId: number]: {
    address: string;
  };
}

interface ResearchProjectFactoryJSON {
  abi: ethers.InterfaceAbi;
  networks?: NetworkMapping;
}

export interface WalletConnection {
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  address: string;
  accounts: string[];
  contractInstance: ethers.Contract;
  balanceInEth: string;
}

interface ConnectWalletOptions {
  requestAccounts?: boolean;
  includeBalance?: boolean;
}

// ---------------- CONNECT WALLET ----------------

const BALANCE_CACHE_TTL_MS = 30_000;
let cachedBalance: { address: string; value: string; expiresAt: number } | null = null;
let inFlightConnection: Promise<WalletConnection> | null = null;

const getCachedBalance = async (
  provider: ethers.BrowserProvider,
  address: string
): Promise<string> => {
  const now = Date.now();
  if (
    cachedBalance &&
    cachedBalance.address.toLowerCase() === address.toLowerCase() &&
    cachedBalance.expiresAt > now
  ) {
    return cachedBalance.value;
  }

  try {
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    cachedBalance = {
      address,
      value: balanceInEth,
      expiresAt: now + BALANCE_CACHE_TTL_MS,
    };
    return balanceInEth;
  } catch {
    // Balance is non-critical for contract interactions, so we avoid failing
    // all calls when RPC is rate-limited on eth_getBalance.
    return cachedBalance?.value ?? "0";
  }
};

export const connectWallet = async (
  options: ConnectWalletOptions = {}
): Promise<WalletConnection> => {
  if (inFlightConnection) {
    // Prevent bursty parallel callers from triggering duplicate RPC requests.
    return inFlightConnection;
  }

  const { requestAccounts = true, includeBalance = false } = options;

  inFlightConnection = (async (): Promise<WalletConnection> => {
  if (typeof window === "undefined") {
    throw new Error("connectWallet must be called in the browser.");
  }

  if (!window.Buffer) {
    window.Buffer = Buffer;
  }

  if (!window.ethereum) {
    throw new Error(
      "Ethereum wallet not detected. Please install MetaMask or a compatible wallet."
    );
  }

  try {
    const listedAccounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[];
    const accounts =
      listedAccounts.length > 0
        ? listedAccounts
        : requestAccounts
        ? ((await window.ethereum.request({
            method: "eth_requestAccounts",
          })) as string[])
        : [];

    if (!accounts.length) {
      throw new Error("No Ethereum accounts found.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    localStorage.setItem("isWalletConnected", "true");

    const network = await provider.getNetwork();
    const networkId = Number(network.chainId);

    const balanceInEth = includeBalance
      ? await getCachedBalance(provider, address)
      : cachedBalance?.value ?? "0";

    const factoryJson = ResearchProjectFactoryABI as ResearchProjectFactoryJSON;
    const factoryData = factoryJson.networks?.[networkId];

    if (!factoryData) {
      throw new Error(`Smart contract not deployed on network ID ${networkId}`);
    }

    const contractInstance = new ethers.Contract(
      factoryData.address,
      factoryJson.abi,
      signer
    );

    return {
      provider,
      signer,
      address,
      accounts,
      contractInstance,
      balanceInEth,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting wallet:", error);
      throw new Error(error.message);
    }
    throw new Error("Unknown wallet connection error");
  }
  })();

  try {
    return await inFlightConnection;
  } finally {
    inFlightConnection = null;
  }
};

// ---------------- PROVIDER HELPERS ----------------

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;

export const initProvider = (): ethers.BrowserProvider | null => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

export const getProvider = (): ethers.BrowserProvider | null => {
  if (!provider) {
    provider = initProvider();
  }
  return provider;
};

export const getSigner = async (): Promise<ethers.Signer | null> => {
  if (!signer) {
    const prov = getProvider();
    if (prov) signer = await prov.getSigner();
  }
  return signer;
};

export const resetWallet = (): void => {
  provider = null;
  signer = null;
  cachedBalance = null;
};
