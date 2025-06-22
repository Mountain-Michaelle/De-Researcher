import { useState, useEffect } from 'react';
import { ethers, Wallet } from 'ethers';
import { connectWallet } from './walletUtils/Wallet';
// import Web3 from "web3";
import './App.css';
import Layout from './Layout';
import LandingPage2 from './app/pages/LandingPage2';
import Projects from './components/LandingPage2Comp/Projects/Projects';
import { Route, Routes } from 'react-router';
import LandingPage1 from './app/pages/LandingPage1';
import ProjectUpload from './components/LandingPage1Comp/Research/ProjectUpload';
import ResearchProjectFactoryABI from './truffle_abis/ResearchProjectFactory.json';
import { Buffer } from 'buffer';
import ResearchDetails from './components/LandingPage1Comp/Research/ResearchDetails';
window.Buffer = Buffer;


// const CONTRACT_ADDRESS = '0xYourContractAddress';

function App() {
  // const [account, setAccount] = useState(null);
  // const [contract, setContract] = useState(null);
  
  
  // useEffect(() => {
  //   const loadBlockchainData = async () => {
  //     const {contractInstance} = await connectWallet();
  //     if (window.ethereum) {
  //       try {
  //         const provider = new ethers.providers.Web3Provider(window.ethereum);
  //         const signer = provider.getSigner();

  //         const accounts = await provider.listAccounts();
  //         // const account = await provider.send("eth_requestAccounts", []);
  //         if (accounts.length > 0) {
  //           console.log("Updated AccountWWWWWWWWWWWWWWWWWWW:");

  //           setAccount(accounts[0]);
  //         }
  //         const networkId = await provider.getNetwork();
  //         console.log("Updated :", networkId);
  //         const chainId = networkId.chainId.toString();


  //         // get network ID
  //         const network_Id = await provider.send("net_version", []);
  //         console.log("Network ID:", network_Id);

  //         // get account balance
  //         const balance = await provider.getBalance(address);
  //         // Format balance in ETH (ethers.js returns balance in Wei, the smallest unit)
  //         const balanceInEth = ethers.utils.formatEther(balance);
  //         console.log(`Balance of account ${address}: ${balanceInEth} ETH`);

  //         // load smart contract data
  //         const ResearchProjectFactoryData = ResearchProjectFactoryABI.networks[network_Id];
  //         const CONTRACT_ADDRESS = ResearchProjectFactoryData.address
  //         console.log("contarct address :", CONTRACT_ADDRESS);
          

  //         const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ResearchProjectFactoryABI.abi, signer);
  //         const testProject = await contractInstance.createResearchProject("fourth project", 770);
  //         console.log("contractInstanceTestProject :", testProject);

  //         // to get all projects

  //         const projects = await contractInstance.getAllProjects();
  //         console.log("contractInstance :", projects);
  //         projects.forEach((project, index) => {
  //           console.log(`Project ${index + 1}: ${project.title}: ${project.totalFunding} : projectAddress: ${project.projectAddress}`);
  //         });
  //         // setContract(contractInstance);
  //       } catch (error) {
  //         console.error("Error loading blockchain data:", error);
  //       }
  //     } else {
  //       console.log("MetaMask is not installed");
  //     }

  //   };

  //   loadBlockchainData();
  //   console.log("Account: ", account);
  // }, []);

  // useEffect(() => {
  //   console.log("Updated Account:", account);
  // }, [account]);

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<LandingPage2 />} />
        <Route path='/home' element={<Projects />} />
        <Route path='/projects' element={<LandingPage1 />} />
        <Route path='/projects/upload' element={<ProjectUpload />} />
        <Route path='/projects/detail/:title/:id' element={<ResearchDetails /> } />
      </Routes>
    </Layout>
  );
}

export default App;
