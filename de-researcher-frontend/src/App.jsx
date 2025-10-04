import { useState, useEffect } from 'react';
import { ethers, Wallet } from 'ethers';
import { connectWallet } from './walletUtils/Wallet';
// import Web3 from "web3";
import './App.css';
import Layout from './Layout';
import LandingPage2 from './app/pages/LandingPage2';
import Projects from './components/LandingPage2Comp/Projects/projects';
import { Route, Routes } from 'react-router';
import LandingPage1 from './app/pages/LandingPage1';
import ProjectUpload from './components/LandingPage1Comp/Research/ProjectUpload';
import ResearchProjectFactoryABI from './truffle_abis/ResearchProjectFactory.json';
import { Buffer } from 'buffer';
import ResearchDetails from './components/LandingPage1Comp/Research/ResearchDetails';
window.Buffer = Buffer;

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<LandingPage2 />} />
        <Route path='/home' element={<Projects />} />
        <Route path='/projects' element={<LandingPage1 />} />
        <Route path='/projects/upload' element={<ProjectUpload />} />
        <Route path='/projects/detail/:title/:creator/:id' element={<ResearchDetails /> } />
      </Routes>
    </Layout>
  );
}

export default App;
