import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { shortenAddress } from '../addressShortener';

export const useWalletConnect = () => {
  const [account, setAccount] = useState(null);
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    try {
      setIsLoading(!!isLoading) // == True
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        const short = shortenAddress(accounts[0]);
        setAccount(short);
        setIsLoading(!isLoading)
        setIsConnected(true)
        localStorage.setItem('isWalletConnected', 'true');
        localStorage.setItem('account', short)
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setIsLoading(!isLoading)
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    localStorage.removeItem('isWalletConnected');
    localStorage.removeItem('account')
    setAccount(null);
    setIsVisible(false)
    isConnected(false)
  }, []);

  const handleCancel = () => {
    setIsVisible(false)
  }

  const checkWalletConnection = useCallback(async () => {
    if (typeof window !== 'undefined' && localStorage.getItem('true')) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const short = shortenAddress(accounts[0]);
          setAccount(short);
          setIsConnected(true)

          console.log("Is connected 2 ", isConnected)
        } else {
          disconnectWallet();
        }
      } catch (err) {
        console.error('Check wallet error:', err);
      }
    }
  }, [disconnectWallet]);

  useEffect(() => {
    checkWalletConnection();

    const handleAccountsChanged = () => checkWalletConnection();
    const handleChainChanged = () => window.location.reload();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkWalletConnection]);

  return { account, connectWallet, disconnectWallet, handleCancel, isConnected};
};
