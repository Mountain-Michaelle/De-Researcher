import React from 'react'
import HeroConnectedWallet from '../../components/LandingPage1Comp/Hero/HeroConnectedWallet'
import Research from '../../components/LandingPage1Comp/Research/Research'
import { useProjectData } from '@/walletUtils/hooks/useProjectData'
// import { useMyProjects } from '@/walletUtils/hooks/useMyProjects'


const LandingPage1 = () => {

  const {projects, myproject, triggerReload} = useProjectData()
    
  return (
    <div className='w-full'>
      <HeroConnectedWallet /> 
      
      {/*** Card project search section */}
      <Research project={projects} myproject={myproject}  triggerReload={triggerReload} />


    </div>
  )
}

export default LandingPage1