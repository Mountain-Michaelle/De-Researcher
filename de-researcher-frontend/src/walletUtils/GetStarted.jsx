import React, { useState, useEffect } from 'react'
import {Popup, Alert } from './WalletPopUps';
import {useWalletConnect} from '../walletUtils/hooks/useConnect';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { redirect, useNavigate } from 'react-router';

const GetStarted = ({title, bgStyle, textColor}) => {
const {account, connectWallet, isConnected} = useWalletConnect()
const navigate = useNavigate()

const handleConnect = () => {
    connectWallet() 
    navigate('/projects')
    }
 
  return (
    <>    {
        isConnected ? '' 
        :
        <AlertDialog>
        <AlertDialogTrigger>
    
        <button className="bg-custom-gradient mt-10 px-7 py-2 rounded-full ">
        Get Started
        </button>

        </AlertDialogTrigger>
        <AlertDialogContent className="bg-custom-gradient">
            <img src="/images/wallet.png" className=" absolute -z-20 -bottom-2 -right-3" width={180} alt="" />
            <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Welcome!</AlertDialogTitle>
            <AlertDialogDescription className="text-red-200 text-[16px]">
                Connect your wallet to get started
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <div className="flex items-center w-full justify-center gap-3">
            <AlertDialogAction onClick={handleConnect}>
                {
                    isConnected ? "Upload Projects" : "Let's Go!"
                   
                }
            </AlertDialogAction>
            </div>
            
        </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>  
    }  
          
    </>
    )
}
export default GetStarted;