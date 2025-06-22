import React, { useEffect, useState } from 'react'
    import { useLocation } from "react-router";
import { shortenAddress } from '@/walletUtils/addressShortener';
import { Button } from '@/components/ui/button';
import { CreateProjectMileStone } from './createProjectMilestone';
const ResearchDetails = () => {
    const [project, setProject] = useState([])
    const location = useLocation();

    // const projects = location.state[0] || {};

    useEffect(() => {
        // window.scrollTo(0, 0);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
        if(location.state){
            setProject(location.state[0])
        }

        
    }, [location.state])
   
    console.log("Project details ", project.projectId)
      return (
        <div className="min-h-screen w-[100%] bg-gray-900 text-white">
          <div className="w-[100%] mt-28 bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center w-full justify-between">
              <span>
                <h1 className="text-3xl font-bold text-blue-400">{project.title}</h1>
                <p className="text-gray-400 mt-2">By: {shortenAddress(project.creator)}</p>
              </span>
              
              <span>
             <CreateProjectMileStone text={"Add Milestones"}  bg='bg-custom-gradient2' 
             contractId={project.projectId} 
             />
              </span>
            </div>
          
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-gray-400">Total Tokens Committed</p>
                <p className="text-xl font-semibold">{project.stake} Wei</p>
              </div>
              <div>
                <p className="text-gray-400">Total Participants</p>
                <p className="text-xl font-semibold">{project.participants} of 300</p>
              </div>
            </div>
    
            <div className="mt-6">
              <p className="text-gray-400">Milestone</p>
              <p className="text-xl font-semibold">{project.milestone}</p>
            </div>

            <div className="mt-6 w-full">
              <p className="text-gray-400">Description</p>
              <p className="text-xs w-9/12 bg-gray-700 bg-opacity-65 text-justify break-all pl-5 pt-5 pb-3">{project.description}</p>
            </div>
    
            <div className="mt-6">
              <p className="text-gray-400">Transaction Hash</p>
              <p className="text-sm break-all bg-gray-700 p-2 rounded">{shortenAddress(project.transactionHash, 8)}</p>
            </div>
    
            <div className="mt-6">
              <p className="text-gray-400">Recipient</p>
              <p className="text-sm break-all bg-gray-700 p-2 rounded">{shortenAddress(project.recipient, 10)}</p>
            </div>
            
    
            <Button
              className="mt-6 w-full bg-custom-gradient hover:bg-blue-600 text-white py-2 rounded-lg transition"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>


            <div className="mt-16">
            <h2>Milestones</h2>


          </div>
          </div>

          
        </div>
      );
    
}

export default ResearchDetails