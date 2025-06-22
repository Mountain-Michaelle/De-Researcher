import React from 'react'
import { topicData } from './topic'
import WalletConnector from '@/walletUtils/WalletConnector'

function Research() {
  return (
    //   {/* Latest Projects */}
      <div id="projects" className="w-full py-16 bg-[#0b1a2b]">
        <h2 className="text-white font-semibold text-left md:text-[200%] text-2xl sm:text-[200%] lg:[50%]  ml-6 mb-5">Latest Research Projects</h2>

        <div className='flex justify-between p-1 pl-2 pr-2 h-[48px] bg-[#FFFFFF0D] md:w-[95%] w-full sm:[100%] lg:[50%]
         rounded-3xl m-auto overflow-hidden'
        style={{border: '1px solid #FFFFFF0D'}}
        >
            {
                topicData.map((topic, index) => {
                    return(
                        <button className='text-white pl-3 pr-3 text-[12px]  overflow-hidden rounded-full '
                        style={{backgroundImage: `${ index === 0 ? 'linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)' : 'none'}`,
                        }}
                        >
                            {topic.title}
                        </button>
                    )
                })
            }
        </div>
        <div className="flex gap-4 m-4" style={{flexFlow: 'wrap', justifyContent:'center'}}> 
        {/* style={{flexFlow: 'wrap row', justifyContent:'center'}}> */}
          {Array(4).fill(0).map((_, index) => (
            <div
              key={index}
              className="bg-[#112240] p-6 rounded-lg md:w-[48%] w-full sm:[100%] lg:[50%]"
             
              >
                <div className=''>
                    <h4 className="text-sm text-white">Blockchain-based Voting System</h4>

                    <span className='flex justify-between mt-14'>
                        <p className="text-sm text-gray-400">By: Jonny Gabriela</p>
                    <p className="mt-1 text-sm text-gray-400">July, 2024</p> 
                    </span>
                
                <div
                    className="sh-full bg-purple-500 rounded-full"
                    style={{ width: "40%" }}
                    >
                    </div>
                    <div className="relative w-full h-0.5 bg-gray-700 rounded">
                    
                </div>
                </div>        
             
              <div className='flex space-x-8 justify-between'>
                <div>
                    <div className="mt-4 text-white/50 text-[10px] text-xs">Total Tokens Committed</div>
                    <p className="font-bold text-white text-xl">200,000 RWA</p>
                    <div className="mt-2 text-white">Milestone</div>
                </div>

                <div>
                    <div className="mt-4 text-[10px] text-white/55">Total Participants</div>
                    <p className="font-bold text-white text-xl">2392</p>
                    <div className="mt-2 text-white">23 of 300</div>
                </div>
              </div>
              <div className="relative w-full h-2 bg-gray-700 rounded-full">
                    <div
                    className="absolute top-0 left-0 h-full bg-custom-gradient rounded-full"
                    style={{ width: "45%" }}
                    ></div>
                </div>
            </div>
          ))}
        </div>

        <div className='w-[95%] m-auto rounded-lg h-100 flex flex-col md:flex-row items-center justify-center my-16' 
        style={{backgroundImage: 'linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)', 
        boxShadow: '0px 13.8px 22.58px 0px #00A3FF17'}}>
            <div className='w-full flex flex-col md:justify-center md:w-[40%]' >
                <h2 className='text-[200%] mt-6 md:mt-0 text-center md:text-left text-white space-x-'>
                Connect your wallet to get started
                </h2>

                <WalletConnector title={"Connect your wallet" } 
                bgStyle='linear-gradient(86.03deg, #A5DEFF 3.48%, #FFFFFF 102.21%)'
                textColor="black"
                 />
            </div>

            <div className='' >
                <img src='/images/wallet.png' alt='wallet' width={'100%'} />
            </div>

        </div>
      </div>
  )
}

export default Research