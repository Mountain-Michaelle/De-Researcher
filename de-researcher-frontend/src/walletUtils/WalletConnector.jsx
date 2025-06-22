import React, { useState, useEffect } from 'react'
import { connectWallet } from './Wallet';
import { ethers } from 'ethers';
import { shortenAddress } from './addressShortener';
import {Popup, Alert } from './WalletPopUps';


const WalletConnector = ({title, bgStyle, textColor}) => {

  const [walletAddress, setWalletAdderess] = useState(null)
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null)
  const [isVisible, setIsVisible] = useState(false)


  const handleConnect = async () => {
   
    try{
      const {address} = await connectWallet();     
      if(address != null ){
        // setWalletAdderess(address);
        const short = shortenAddress(address)
        setAccount(short)
        setError(null)
      }
    
    } catch(error){
      setError(error.message);
    }
  }

  
  const handlePopUp = () => {
    setIsVisible(true)
  }
  const handleDisconnect = async () => {
    localStorage.removeItem("isWalletConnected")
    setAccount(null)
    setIsVisible(false)
  }

  const handleCancel = () => {
    setIsVisible(false)
  }

  useEffect( () => {
    const checkWalletConnection =  async () => {
      if(localStorage.getItem("isWalletConnected") === "true"){
        if(typeof window.ethereum !== "undefined"){
          try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            if(accounts.length > 0){
              const short = shortenAddress(accounts[0])
              setAccount(short)
            }else{
              localStorage.removeItem("isWalletConnected")
            }
          }
          catch(error){
            console.log("Error connecting to wallet, ", error)
          }
        }
      } 
    }

    // const monitorDisconnection = async () => {

    // }

  checkWalletConnection()
  },[])
    
  return (
    <>
    {
      !account ? 
      (
      <button onClick={handleConnect} className="bg-custom-gradient lg:w-[190px] md:w-[180px] m-auto text-center p-3 rounded-full text-[18px] text-white"
      style={{background: bgStyle, color:textColor}}
      >
        Connect Wallet
      </button> 
      )
      :
      (
      <Alert handleDisconnect={handleDisconnect} text={"You are about to disconnect your wallet!"} 
        account={account} handleCancel={handleCancel} />
      )
    }
     </>
    
  )
}

export default WalletConnector