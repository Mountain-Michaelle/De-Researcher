import React, { useState, useEffect } from 'react'
import {Popup, Alert } from './WalletPopUps';
import {useWalletConnect} from '../walletUtils/hooks/useConnect';


const WalletConnector = ({title, bgStyle, textColor}) => {
const {account, connectWallet, disconnectWallet, handleCancel} = useWalletConnect()

    
  return (
    <>
    {
      !account ? 
      (
      <button onClick={connectWallet} className="bg-custom-gradient lg:w-[190px] md:w-[180px] m-auto text-center p-3 rounded-full text-[18px] text-white"
      style={{background: bgStyle, color:textColor}}
      >
        Connect Wallet
      </button> 
      )
      :
      (
      <Alert handleDisconnect={disconnectWallet} text={"You are about to disconnect your wallet!"} 
        account={account} handleCancel={handleCancel} />
      )
    }
     </>
    
  )
}

export default WalletConnector