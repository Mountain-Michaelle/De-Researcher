import React, { useState, useEffect } from 'react'
import ProjectExpiryTime from './ProjectExpiryTime'
import { Link } from 'react-router'
const Projects = () => {
  
  return (
      //  {/* Hero Section */}
    <div className='w-[100%] flex flex-col justify-center mb-20'>
      
      <div className='w-[90%] relative m-auto flex flex-col mt-36
                 items-center justify-center text-gray-50 bg-[] rounded-2xl'
          style={{border: '1px solid #FFFFFF14', backgroundColor:'#FFFFFF0A'}}
        >
          
        <Link to='/' className='absolute text-white flex items-center -top-10 left-0'>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5603 5.22217C14.051 5.22217 14.449 5.62017 14.449 6.11084C14.449 6.35617 14.3496 6.57817 14.189 6.7395L10.373 10.5555L14.189 14.3715C14.3436 14.5315 14.4383 14.7488 14.4383 14.9888C14.4383 15.4795 14.0403 15.8775 13.5496 15.8775C13.3096 15.8775 13.0916 15.7822 12.9316 15.6275L8.48764 11.1835C8.32698 11.0228 8.22697 10.8002 8.22697 10.5548C8.22697 10.3095 8.32631 10.0875 8.48764 9.92617L12.9323 5.4815C13.093 5.32084 13.3143 5.22084 13.5596 5.22084C13.5603 5.22084 13.5603 5.22084 13.561 5.22084L13.5603 5.22217Z" fill="white"/>
        </svg>

        Back Home
      </Link>
      <section className='flex flex-col md:flex-row lg:flex-row justify-evenly xs:gap-10 md:justify-between lg:justify-between items-center
       w-full pr-4 pl-4 lg:pr-10 lg:pl-10 pt-5 mb-4'>

        <button to="#" className='bg-[#42A9E3] p-1 rounded-full '>blockchain & Cryptocurrency</button>

        <span className='text-center md:text-left lg:text-left'>
          <h2 className='text-lg'>Status</h2>
          <button className='text-[#42E3DF] text-sm'>IN PROGRESS</button>
        </span>
      </section>


      <section className='flex w-[100%] flex-col lg:flex-row gap-8 md:flex-row mb-8 pl-10 pr-10'>

          <div className="pt-5 justify-center text-left w-full lg:w-[80%]">
           <h1 className="text-2xl text-center lg:text-left md:text-left
            w-full md:text-2xl mb-6 md:mb-2 lg:mb-3 text-white font-bold">
           Developing a Secure,and Scalable Blockchain-Based Voting System for Election Integrity
           </h1>
           <span className='text-white/80 text-sm'>
           This Research is about a decentralized voting system leveraging blockchain for secure and transparent elections. 
           The project focuses on following areas:
            <ul className='list-disc p-y-2 ml-4 mt-4'>
              <li>Scalability</li>
              <li>Security</li>
              <li>User privacy</li>
              <li>Transparency
              </li>
            </ul>
           </span>
          </div>

          <div
          className="bg-center w-full grid grid-cols-2 sm:grid-cols-2 rounded-lg
          md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-4"
          style={{ border: '1px solid #FFFFFF14' }}
          >
      {
        [
          {
            head: "Date Created",
            data: '21st August, 2024',
          },
          {
            head: "Deadline",
            data: '21st October, 2024',
          },
          {
            head: "Token Incentive Pool",
            data: '3,000,000 RWA',
          },
          {
            head: "Token Available",
            data: '1,200,000 RWA',
          },
          {
            head: "Total Researchers",
            data: '30',
          },
          {
            head: "Token Earned",
            data: '250 RWA',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-center p-4 rounded-lg shadow-sm"
          >
            <span className="text-white text-[16px] font-semibold">
              {item.head}
            </span>
            <span className="text-white/70 text-[10px] mt-2">
              {item.data}
            </span>
          </div>
        ))
      }
          </div>
      </section>

   {/** Contribution Section */}
       <section className='w-[95%] flex flex-col justify-center mb-8'>
        <h2 className='mb-3'>Submit your contribution</h2>

        <div className='flex flex-col justify-center gap-4 m-auto w-[100%]'>
          {
            [
              {
                step:'1',
                type: 'Scalability',
                contributors: '20',
                rwa: '250',
                status: false
              },
              {
                step:'2',
                type: 'Security in Decentralized Voting',
                contributors: '20',
                rwa: '250',
                status: true
              },
              {
                step:'3',
                type: 'User privacy in Decentralized Voting',
                contributors: '',
                rwa: '250',
                status: true
              },
              {
                step:'4',
                type: 'Transparency in Decentralized Voting ',
                contributors: '',
                rwa: '250',
                status: true
              },
            ].map((item, index) => {
              return(
                <div key={index} className='w-[100%] bg-[#FFFFFF0A] rounded-xl space-x-2 flex justify-between p-5' >
                  <div>{item.step}.</div>

                  <div className='flex flex-col justify-start text-left'>
                    <span>{item.type}</span>
                    <span>{item.contributors}</span>
                  </div>

                  <div>{item.rwa} RWA</div>

                  <div>
                    {
                      item.status ? <button className='p-2 rounded-full text-sm lg:text-lg md:text-[15px]'
                      style={{border: '1px solid #42E3DF'}}>Submit Contribution</button> :
                      <button className='text-orange-400'>Closed</button>
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
       </section>

       <section className='w-full mt-10'>
        <ProjectExpiryTime numOfdays={30} />
       </section>
       


       </div>
      </div>
       
  )
}

export default Projects