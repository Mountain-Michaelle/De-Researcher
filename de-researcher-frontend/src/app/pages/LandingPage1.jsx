import React from 'react'
import HeroConnectedWallet from '../../components/LandingPage1Comp/Hero/HeroConnectedWallet'
import Research from '../../components/LandingPage1Comp/Research/Research'


const LandingPage1 = () => {
    
  return (
    <div className='w-full'>
      <HeroConnectedWallet /> 
      
      {/*** Card project search section */}
      <Research />


    </div>
  )
}

export default LandingPage1