import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { shortenAddress } from '../addressShortener';

export const useWalletConnect = () => {
  const [account, setAccount] = useState(null);
  const [isVisible, setIsVisible] = useState(false)

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        const short = shortenAddress(accounts[0]);
        setAccount(short);
        localStorage.setItem('isWalletConnected', 'true');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    localStorage.removeItem('isWalletConnected');
    setAccount(null);
    setIsVisible(false)
  }, []);

  const handleCancel = () => {
    setIsVisible(false)
  }

  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const short = shortenAddress(accounts[0]);
          setAccount(short);
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

  return { account, connectWallet, disconnectWallet, handleCancel };
};
