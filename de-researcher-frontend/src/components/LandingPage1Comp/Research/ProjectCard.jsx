import React from 'react'
import { shortenAddress } from '@/walletUtils/addressShortener'
import { Button } from '@/components/ui/button'
import { ChevronsRight } from 'lucide-react'
import { useNavigate } from 'react-router'

const ProjectCard = ({project, index, openIndex}) => {
    const navigate = useNavigate()

    const handleNavigate = (projectId, title) => {
        navigate(`detail/${title}/${projectId}`, { state: project })
    }
  return (
    <div className={ openIndex === index ? "flex gap-4 m-4": "hidden"} style={{flexFlow: 'wrap', justifyContent:'center'}}> 
    <>
        {
           Array.isArray(project) &&  project?.map((projData, index) => {
                return(
                <div
                key={index}
                className=" animate-in slide-in-from-right duration-500 bg-[#112240] p-6 rounded-lg md:w-[48%] w-full sm:[100%] lg:[50%]"
                
                >
                    <div className=''>
                        <h4 className="text-white text-2xl`1">{projData?.title}</h4>

                        <span className='flex justify-between mt-14'>
                            <p className="text-sm text-gray-400">By: {shortenAddress(projData?.creator)}</p>
                        <p className="mt-1 text-sm text-gray-400">{projData?.date}</p> 
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
                        <p className="font-bold text-white text-xl">{projData?.stake && projData.stake} <small>Wei</small></p>
                        <div className="mt-2 text-white">Milestone</div>
                    </div>

                    <div>
                        <div className="mt-4 text-[10px] text-white/55">Total Participants</div>
                        <p className="font-bold text-white text-xl">2392</p>
                        <div className="mt-2 text-white">23 of 300</div>
                    </div>
                </div>
                    <div className="flex flex-col p-5">
                        <div className="w-full h-[2px] bg-gray-700 rounded-full"></div>
                        {/* <div
                        className="absolute top-0 left-0 h-full bg-custom-gradient rounded-full"
                        style={{ width: "45%" }}
                        ></div> */}
                        <div className='w-full p-3 relative flex justify-end'>
                            <Button onClick={() => {handleNavigate(projData.projectId, projData.title)}} className="w-fi bg-custom-gradient border-none absolute right-0 mt-2 text-gray-200">View More <ChevronsRight /></Button>
                        </div>
                        
                    </div>
                </div>
                )
            })
     
        }
    </>
    </div>
  )
}

export default ProjectCard