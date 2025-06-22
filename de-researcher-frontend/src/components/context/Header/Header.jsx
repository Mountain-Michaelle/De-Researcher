import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import WalletConnector from '../../../walletUtils/WalletConnector';
import { Dropdown } from './DropDown';




const Header = () => {

    const [sticky, setSticky] = useState(false);

    const handleStickyNavbar = () => {
      if (window.scrollY >= 80) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    useEffect(() => {
      window.addEventListener("scroll", handleStickyNavbar);
    });


  return (
    <header
    className={`header left-0 top-0 z-40 flex w-[100%] items-center ${ sticky
        ? "dark:shadow-sticky-dark fixed z-[9999] !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
        : "absolute bg-transparent"
        }`}
        > 
        <div className="flex placeholder:w-full w-[100%] py-3 justify-between md: pr-3 pl-3 items-center">

        <div className=''>
            <Link to="/" className="text-2xl ml-2 font-bold text-white">
                <span className="text-blue-500 text-xl">Bloc-</span>search
            </Link> 
        </div>
        
        
        <div className="text-white ml-18 items-center gap-4 flex justify-between text-lg px-5">
          <div className='hidden md:flex lg:flex sm:hidden  w-full gap-8'>
          <Link className='text-[16px]' to="/">How it works</Link >
            <Link className='text-[16px]' to="projects">Projects</Link >
          </div>
          <div className='flex md:hidden'>
            <Dropdown />
          </div>
          <div className='hidden md:flex'>
            <WalletConnector />
            {/* <ThemeToggler /> */}
          </div>
        </div>
        
        </div>  
  </header>


  )
}

export default Header