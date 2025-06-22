import { useEffect, useState } from 'react'
import { BrowserRouter, Route, useLocation } from 'react-router'
import Header from './components/context/Header/Header'
import { ThemeProvider } from './context/Provider'
import Footer from './components/context/Footer/Footer'
import { Toaster } from './components/ui/toaster'
import { Toast } from 'bootstrap'

const Layout = ({children}) => {
  
  const [showFooter, setShowFooter] = useState(null);
  const path = useLocation();

  useEffect(() => {
    if(path.pathname === '/projects/upload'){
      setShowFooter(true)
    }else{
      setShowFooter(false)
    }

  },[path.pathname])

  return (
  <ThemeProvider attribute="class">
    <div className="w-[100%] h-[100vh] overflow-auto bg-gradient-to-b from-[#0E1526] via-[#162B54] to-[#0E1526] relative"
    style={{msOverflowStyle:"none", scrollbarWidth:"none"}}
    >
    {/** background bobs */}
    <img className='absolute right-0 top-0 text-red-500 b -z-10' src="/images/bobs/bob1.svg" width={'100%'} alt="" /> 
    {/** Bobs ends */}

        <Header />
        {children}
        <Toaster />

        <Footer showFooter={showFooter} />   
          
    </div>
  </ThemeProvider>
  )
}

export default Layout