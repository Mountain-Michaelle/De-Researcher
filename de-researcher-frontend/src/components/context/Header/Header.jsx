import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import WalletConnector from '../../../walletUtils/WalletConnector';
import {useDispatch, useSelector} from 'react-redux';
import {disconnectWallet} from '../../../redux/wallet/walletActions';
import { AlertUp } from '@/walletUtils/Alert';

import { Dropdown } from './DropDown';


const Header = () => {
  const [sticky, setSticky] = useState(false);
  const {error} = useSelector((state) => state.wallet);
  const dispatch = useDispatch()

  useEffect(() => {
    const getScrollTop = () => {
      const scEl = document.scrollingElement || document.documentElement || document.body;
      return scEl.scrollTop ?? window.scrollY ?? 0;
    };

    const handleStickyNavbar = () => {
      const scrollY = getScrollTop();
      const threshold = 50;
      setSticky(scrollY >= threshold);
    };

    window.addEventListener("scroll", handleStickyNavbar);
    handleStickyNavbar(); // run once on mount

    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

 useEffect(() => {
  const handleStickyNavbar = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const newSticky = scrollY >= 50;
    setSticky(newSticky);
    console.log("scrollY:", scrollY, "sticky:", newSticky);
  };

  window.addEventListener("scroll", handleStickyNavbar);
  handleStickyNavbar(); // run once on mount

  return () => window.removeEventListener("scroll", handleStickyNavbar);
}, []);

useEffect(() => {
    document.body.style.overflow = error ? "hidden" : "auto";
  }, [error]);
  console.log(sticky, "Sticky")

  return (
    <header
      className={`flex z-40 w-full ${
        sticky
          ? "fixed top-0 left-0 dark:shadow-sticky-dark z-[9999] !bg-opacity-80 shadow-sticky backdrop-blur-sm transition bg-black"
          : "relative bg-transparent"
      }`}
    > 
      <div className="flex w-full py-3 justify-between md:pr-3 pl-3 items-center">
        <div>
          <Link to="/" className="text-2xl ml-2 font-bold text-white">
            <span className="text-blue-500 text-xl">Bloc-</span>search
          </Link> 
        </div>

        <div className="text-white items-center gap-4 flex justify-between text-lg px-5">
          <div className="hidden md:flex lg:flex sm:hidden w-full gap-8">
            <Link className="text-[16px]" to="/">How it works</Link>
            <Link className="text-[16px]" to="projects">Projects</Link>
          </div>
          <div className="flex md:hidden">
            <Dropdown />
          </div>
          <div className="hidden md:flex">
            <WalletConnector />
          </div>
            {
                  error ? 
                  <div onClick={() => dispatch(disconnectWallet())} className='fixed inset-0 z-100 left-0 top-0 w-full -mt-10 md:m-0
                   h-[100%] flex flex-1 justify-center items-center bg-red-500/10'>
                    <AlertUp 
                    text={error.toLowerCase().includes("wallet_requestpermissions") ?
                       'Request already pending for this origin' : error} variant="destructive"
                     description={`
                     ${error?.toLowerCase().includes("pending") ? "User request pending, please wait or check your wallet.":''}
                     ${error?.toLowerCase().includes("rejected") ? "User request is aborted": ''}
                     ${error?.toLowerCase().includes("not installed") ? "Please install a wallet extension to continue.": ''}
                     `}/>
                  </div>
                  : 
                  ''
                } 
        </div>
      </div>  
    </header>
  )
}

export default Header
