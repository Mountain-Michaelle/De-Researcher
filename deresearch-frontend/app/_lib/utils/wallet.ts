"use client";

import { ethers } from "ethers";
import ResearchProjectFactoryABI from "../../truffle_abis/ResearchProjectFactory.json";
import { Buffer } from "buffer";

declare global {
  interface Window {
    ethereum?: any;
    Buffer?: typeof Buffer;
  }
}

export interface WalletConnection {
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  address: string;
  accounts: string[];
  contractInstance: ethers.Contract;
  balanceInEth: string;
}

export const connectWallet = async (): Promise<WalletConnection> => {
  if (typeof window === "undefined") {
    throw new Error("connectWallet must be called in the browser.");
  }

  // Assign Buffer only in browser
  if (!window.Buffer) {
    window.Buffer = Buffer;
  }

  if (!window.ethereum) {
    throw new Error(
      "Ethereum wallet is not installed. Please install MetaMask or another compatible wallet."
    );
  }

  try {
    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    localStorage.setItem("isWalletConnected", "true");

    const network = await provider.getNetwork();
    const networkId = Number(network.chainId);

    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);

    const factoryData =
      (ResearchProjectFactoryABI as any).networks?.[networkId];
    if (!factoryData) {
      throw new Error(`Contract not deployed on network ID ${networkId}`);
    }

    const contractInstance = new ethers.Contract(
      factoryData.address,
      ResearchProjectFactoryABI.abi,
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
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    throw new Error(error?.message ?? "Failed to connect wallet");
  }
};

// Provider helpers
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;

// export function initProvider(): ethers.BrowserProvider | null {
//   if (typeof window === "undefined" || !window.ethereum) return null;
//   if (!provider) provider = new ethers.BrowserProvider(window.ethereum);
//   return provider;
// }

export const initProvider = (): ethers.BrowserProvider | null => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return null;
};

export function getProvider(): ethers.BrowserProvider | null {
  return provider || initProvider();
}

export async function getSigner(): Promise<ethers.Signer | null> {
  if (!signer) {
    const prov = getProvider();
    if (prov) signer = await prov.getSigner();
  }
  return signer;
}

export function resetWallet() {
  provider = null;
  signer = null;
}
