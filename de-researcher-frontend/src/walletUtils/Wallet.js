import { ethers } from "ethers";
import ResearchProjectFactoryABI from '../truffle_abis/ResearchProjectFactory.json';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

export const connectWallet = async () => {
    if (!window.ethereum) {
        throw new Error("Ethereum wallet is not installed. Please install MetaMask or another compatible wallet to use this feature.");
    }

    try {
        // Request account access from MetaMask
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        // Connect to the first account
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        localStorage.setItem("isWalletConnected", "true");

        // get network ID
        const network_Id = await provider.send("net_version", []);
        console.log("Network ID:", network_Id);

        // get account balance
        const balance = await provider.getBalance(address);
        // Format balance in ETH (ethers.js returns balance in Wei, the smallest unit)
        const balanceInEth = ethers.utils.formatEther(balance);
        console.log(`Balance of account ${address}: ${balanceInEth} ETH`);

        // load smart contract data
        const ResearchProjectFactoryData = ResearchProjectFactoryABI.networks[network_Id];
        const CONTRACT_ADDRESS = ResearchProjectFactoryData.address
        
        
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ResearchProjectFactoryABI.abi, signer);
     

        return { provider, signer, address, accounts, contractInstance,  balanceInEth};
       

    } catch (error) {
        console.error("Error connecting to wallet =>", error);
        throw error;
    }
};

let provider = null;
let signer = null;

export function initProvider() {
  if (!provider && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  }
  return provider;
}

export function getProvider() {
  return provider || initProvider();
}

export function getSigner() {
  if (!signer) {
    const prov = getProvider();
    signer = prov.getSigner();
  }
  return signer;
}

export function resetWallet() {
  provider = null;
  signer = null;
}