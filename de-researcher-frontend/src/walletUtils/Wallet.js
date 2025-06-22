import { ethers } from "ethers";
import ResearchProjectFactoryABI from '../truffle_abis/ResearchProjectFactory.json';
import ResearchProjectABI from "../truffle_abis/ResearchProject.json";
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
        // const testProject = await contractInstance.createResearchProject("fifth project", 770);
        // console.log("contractInstanceTestProject :", testProject);

        // code to get milestone
        // const projectAddress = await contractInstance.getProjectAddress(1);
        // console.log(`projectAddress ${projectAddress}`);
        // const projectContract = new ethers.Contract(projectAddress, ResearchProjectABI.abi, signer);
        // const milestones = await projectContract.getAllMilestones();
        // console.log(`milestones ${milestones}`);

        // code to add milestone
        // const title = "third milestone";
        // const description = "third Smart contract milestone";
        // const deadline = 1755907200; // Future timestamp
        // const reward = 100;
        // const contentHash = ethers.keccak256(ethers.toUtf8Bytes(title));
        // //Send transaction to add milestone
        // const projectContract = new ethers.Contract(projectAddress, ResearchProjectABI.abi, signer);
        // const tx = await projectContract.addMilestone(title, description, deadline, reward, contentHash);
        // await tx.wait();  // Wait for transaction to be confirmed

        // console.log("Milestone added successfully!");

        return { provider, signer, address, accounts, contractInstance,  balanceInEth};
       

    } catch (error) {
        console.error("Error connecting to wallet =>", error);
        throw error;
    }
};
