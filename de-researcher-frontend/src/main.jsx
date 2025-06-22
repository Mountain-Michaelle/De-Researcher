import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'


createRoot(document.getElementById('root')).render(
  <StrictMode className='bg-[#FCFCFC] dark:bg-black'>
    <BrowserRouter>
      <App />
    </BrowserRouter>  
  </StrictMode>,
)
