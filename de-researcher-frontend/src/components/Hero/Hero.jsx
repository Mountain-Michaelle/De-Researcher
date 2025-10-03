import React from 'react'
import Hero2 from './Hero2'
import {useDispatch, useSelector} from 'react-redux';
import {disconnectWallet} from '../../redux/wallet/walletActions';
import {tokenData} from './tokenData'
import GetStarted from '@/walletUtils/GetStarted'
import { AlertUp } from '@/walletUtils/Alert';
function Hero() {
    const {error} = useSelector((state) => state.wallet);
    const dispatch = useDispatch()
    
  return (
    
    <div className='w-[100%]'>
          {/* Hero Section */}
          
        <div className='w-full flex flex-col lg:flex-row items-center justify-center text-gray-50'>
            <div className="flex lg:space-x-3 flex-col lg:flex-start items-center lg:items-baseline w-full py-20 lg:w-[50%] justify-center">
                <h1 className="text-6md text-[200%] text-center lg:text-left md:text-5xl text-white font-bold">
                Empower Research, Reward Innovation
                </h1>
                <p className="text-lg text-gray-300 lg:2xl text-center lg:text-left mt-4">
                Submit your project topics, incentivize research, and unlock progress with the
                power of blockchain.
                </p>
                
              
                <GetStarted />
               
            </div>

           <div className='h-96 hidden  lg:flex justify-center w-[100%] lg:w-[30%] bg-cover overflow-hidden bg-center relative'>
              <img src='/images/explore2.svg' className='object-cover z-20 absolute w-[400px]' alt="" />
              <img src='/images/explore.svg' className='object-cover z-10 absolute -right-10 -bottom-20' />
            </div>  
        </div>
      
        {/** Hero Non Wallet */}
        <Hero2 />

         {/* Supported Tokens */}
      <section className="bg-[#0b1a2b] text-center text-white py-10">
        <h2 className="text-[200%] md:text-[30px] sm:text-[15px] font-semibold">Supported Networks/Tokens</h2>
        <div className="flex justify-between mr-20 ml-20 flex-wrap gap-4 mt-8">
          {
            tokenData.map((token, index) => {
                return(
                    <img src={token.image} key={index} alt={token.name} />
                )
            })
          }
        </div>
      </section>
    </div>
  )
}

export default Hero