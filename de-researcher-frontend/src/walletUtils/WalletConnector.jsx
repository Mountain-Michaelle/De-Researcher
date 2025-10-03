import React, { useState, useEffect } from 'react'
import {Alert } from './WalletPopUps';
import {useWalletConnect} from '../walletUtils/hooks/useConnect';
import {useDispatch, useSelector} from 'react-redux';
import {connectWallet, checkWalletConnection} from '../redux/wallet/walletActions';

const WalletConnector = ({title, bgStyle, textColor}) => {
const {account, handleCancel} = useWalletConnect()
const dispatch = useDispatch()
const {shortAddress, isConnected, loading, error} = useSelector((state) => state.wallet);

console.log(error, "Error here")

useEffect(() => {
  dispatch(checkWalletConnection())
  if(window.ethereum){
    window.ethereum.on("accountChanged", () => {
      dispatch(checkWalletConnection());
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    })

  }
},[dispatch])
    
  return (
    <>
    {
      !isConnected ? 
      (
      <button onClick={() => dispatch(connectWallet())} className="bg-custom-gradient
       lg:w-[190px] md:w-[180px] m-auto text-center p-3 rounded-full text-[18px] text-white"
      style={{background: bgStyle, color:textColor}}
      >
        {loading ? "Connecting..." : "Connect Wallet"}
      </button> 
      )
      :
      (
      <Alert
       text={"Go to metaMask and disconnect your wallet!"} 
        account={shortAddress} 
        handleCancel={handleCancel} />
      )
    }
     </>
    
  )
}

export default WalletConnector 