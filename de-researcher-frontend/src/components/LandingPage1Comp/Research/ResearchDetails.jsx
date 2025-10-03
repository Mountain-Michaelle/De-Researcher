import React, { useEffect, useState } from 'react'
import { shortenAddress } from '@/walletUtils/addressShortener';
import { Button } from '@/components/ui/button';
import { CreateProjectMileStone } from './createProjectMilestone';
import {useParams} from "react-router-dom";
import { ethers } from "ethers";
import {connectWallet} from '../../../walletUtils/Wallet';
import ResearchProjectABI from "../../../truffle_abis/ResearchProject.json"
import { getMilliseconds } from 'date-fns/getMilliseconds';



const ResearchDetails = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const [milestone, setMilestone] = useState([])
    const [projectDetails, setProjectDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const {id} = useParams();

    console.log(id, 'state of prev project')
 const getMilestones = async (projectId) => {
  
        try{
                const {contractInstance, signer} = await connectWallet() 
        const projectAddress = await contractInstance.getProjectAddress(projectId)
        const projectContract = new ethers.Contract(projectAddress, ResearchProjectABI.abi, signer)
        const milestones = await projectContract.getAllMilestones();
        console.log("Milestone ", milestones)
        const formattedMilestones = milestones.map((m, idx) => ({
              id: idx,
              title: m[0],
              description: m[1],
              amount: ethers.BigNumber.from(m[2]).toString(),       // convert hex → decimal string
              deadline: ethers.BigNumber.from(m[3]).toString(),     // convert hex → decimal string
              isCompleted: m[4],
              recipient: m[5],
              progress: ethers.BigNumber.from(m[6]).toString(),
              hash: m[7]
            }));
        setMilestone(formattedMilestones)
        }
        catch(error) {
          console.log(error, "Getting milesonte error")
          setMilestone(error)
        }
      }
  

useEffect(() => {
  const getProjectDetail = async (projectId) => {
    try {
      setIsLoading(true)
      const { contractInstance } = await connectWallet();
      const resp = await contractInstance.getProjectDetails(projectId);

      // resp is an array of arrays -> take the first one
      console.log(resp, "Response")
      const raw = resp[0]; 

      if (raw && raw?.length) {
        console.log(raw, "raw")  
        const formatted = {
          title: raw[0],
          description: raw[1],
          recipient: raw[3],
          transactionHash: raw[4],
          creator: raw[5],
          extras: raw[7]
        };
        console.log(formatted, "Formated")
        setProjectDetails(formatted);
      }
      setIsLoading(false)
    } catch (error) {
      setErrorMessage(error.message || error.toString());
      setIsLoading(false)
    }
  };
  getProjectDetail(id);
  getMilestones(id)
}, [id]);

console.log(milestone, "Mile stone oh")
    useEffect(() => {
        // window.scrollTo(0, 0);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    }, [location.state])
   
    // console.log("Project details ", project.projectId)
      return (
        <div className="min-h-screen w-[100%] bg-gray-900 text-white relative">
          { isLoading ?
          <div className='w-full h-full absolute flex justify-center'>
              <img src='/images/eclipse.gif' alt="" className='w-[300px] h-[300px]' />
          </div>:
          ''

          }
          <div className="w-[100%] mt-28 bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center w-full justify-between">
              <span>
                <h1 className="text-3xl font-bold text-blue-400">{projectDetails?.title}</h1>
                <p className="text-gray-400 mt-2">By: {shortenAddress(projectDetails?.creator)}</p>
              </span>
              
              <span>
             <CreateProjectMileStone onMilestoneAdded={() => getMilestones(id)} text={"Add Milestones"}  bg='bg-custom-gradient2' 
             contractId={id} 
             />
              </span>
            </div>
          
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-gray-400">Total Tokens Committed</p>
                <p className="text-xl font-semibold">{projectDetails?.stake} Wei</p>
              </div>
              <div>
                <p className="text-gray-400">Total Participants</p>
                <p className="text-xl font-semibold">{projectDetails?.participants} of 300</p>
              </div>
            </div>
    
            <div className="mt-6">
              <p className="text-gray-400">Milestone</p>
              <p className="text-xl font-semibold">{projectDetails?.milestone}</p>
            </div>

            <div className="mt-6 w-full">
              <p className="text-gray-400">Description</p>
              <p className="text-xs w-9/12 bg-gray-700 bg-opacity-65 text-justify break-all pl-5 pt-5 pb-3">{projectDetails?.description}</p>
            </div>
    
            <div className="mt-6">
              <p className="text-gray-400">Transaction Hash</p>
              <p className="text-sm break-all bg-gray-700 p-2 rounded">{shortenAddress(projectDetails?.transactionHash, 8)}</p>
            </div>
    
            <div className="mt-6">
              <p className="text-gray-400">Recipient</p>
              <p className="text-sm break-all bg-gray-700 p-2 rounded">{shortenAddress(projectDetails?.recipient, 10)}</p>
            </div>
            
    
            <Button
              className="mt-6 w-full bg-custom-gradient hover:bg-blue-600 text-white py-2 rounded-lg transition"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>


        <div className="mt-16">
            <h2>Milestones</h2>
          {milestone.length > 0 ? (
            <div className="space-y-4">
              {milestone.map(m => (
                <div key={m.id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-blue-400 font-semibold">{m.title}</h3>
                  <p className="text-gray-300">{m.description}</p>
                  <p className="text-sm">Amount: {m.amount} ETH</p>
                  <p className={`text-sm ${m.isCompleted ? "text-green-400" : "text-yellow-400"}`}>
                    {m.isCompleted ? "Completed" : "Pending"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-400">No milestones added yet.</p>
          )}
          </div>
          </div>

          
        </div>
      );
    
}

export default ResearchDetails