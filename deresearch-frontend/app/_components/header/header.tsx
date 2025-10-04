"use client"
import React, { useEffect, useState } from 'react';
import Link  from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../_redux/store';
import { disconnectWallet } from '../../_redux/wallet/walletActions';
import WalletConnector from '../walletConnector';
import { AlertUp } from '../modals/alert';
import { Dropdown } from './dropDown';


const Header: React.FC = () => {
  const [sticky, setSticky] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.wallet);
  
  // Sticky header effect
  useEffect(() => {

      const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.3; //
      setSticky(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when error modal is visible
  useEffect(() => {
    document.body.style.overflow = error ? 'hidden' : 'auto';
  }, [error]);

  return (
    <header
      className={`w-full z-40 transition-all ${
        sticky
          ? 'fixed top-0 left-0 bg-black/50 backdrop-blur-sm shadow-lg z-[9999]'
          : 'relative bg-transparent'
      }`}
    >
      <div className="flex w-full max-w-7xl
       mx-auto items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-blue-500">Bloc-</span>search
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-white text-lg">
          <div className="hidden md:flex gap-8">
            <Link className="text-[16px] hover:text-blue-400" href="/">
              How it works
            </Link>
            <Link className="text-[16px] hover:text-blue-400" href="/projects">
              Projects
            </Link>
          </div>

          {/* Mobile dropdown */}
          <div className="flex md:hidden">
            <Dropdown />
          </div>

          {/* Wallet Connector */}
          <div className="hidden md:flex">
            <WalletConnector />
          </div>
        </nav>
      </div>

      {/* Error modal */}
      {error && (
        <div
          onClick={() => dispatch(disconnectWallet())}
          className="fixed inset-0 z-[10000] flex justify-center items-center bg-black/60 backdrop-blur-sm px-4"
        >
          <AlertUp
            text={
              error.toLowerCase().includes('wallet_requestpermissions')
                ? 'Request already pending for this origin'
                : error
            }
            variant="destructive"
            description={`
              ${
                error?.toLowerCase().includes('pending')
                  ? 'User request pending, please wait or check your wallet.'
                  : ''
              }
              ${
                error?.toLowerCase().includes('rejected')
                  ? 'User request is aborted.'
                  : ''
              }
              ${
                error?.toLowerCase().includes('not installed')
                  ? 'Please install a wallet extension to continue.'
                  : ''
              }
            `}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
