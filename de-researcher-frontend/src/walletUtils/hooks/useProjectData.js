import { useState, useEffect } from "react";
import { connectWallet } from "../Wallet";
import { ethers } from "ethers";



export function useProjectData(){
    const [projects, setProjects] = useState([]);
    const [myproject, setMyProjects] = useState([])
    const [contractAddress, setContractAddress] = useState([])
    const [reloadTrigger, setReloadTrigger] = useState(0) // changes to triggger re-fetch

    const fetchAllProjects = async () => {
        const {contractInstance} = await connectWallet();
        const proj = await contractInstance.getAllProjects();
        // const projCreator = await contractInstance.getProjectsByCreator(contractAddress)
        // console.log("This is contract intance", proj)

        if(proj.length > 0){
            const cleanData = proj[0].map(item => ({
              title: item[0], 
              description: item[1],
              stake: ethers?.BigNumber.from(item[2]).toString(), //BigNumber to hex
              creator: item[3],
              projectId:item[6] ,
              investor: item[5],
              contributors:item[4]
          }));
          
            const lastFourProject = cleanData.slice(-4).reverse()
            setContractAddress(cleanData.contractAddress)
            setProjects(Array.isArray(lastFourProject) ? lastFourProject : []) // Forced into Array
            
          }else{
            setProjects([]);
          }     
    } 
    const fetchMyprojects = async () => {
        const {contractInstance, address} = await connectWallet()
        const proj = await contractInstance.getProjectsByCreator(address)
        if(Array.isArray(proj) && proj.length > 0){
        //     const cleanData = proj[0]
        //         .filter(item => Array.isArray(item) && item.length > 0)
        //         .map(item => ({
        //         title: item[0], 
        //         description: item[1],
        //         // stake: ethers.utils.formatEther(item[2]), //BigNumber to wei
        //         //   stake: ethers.BigNumber.from(item[2]).toString(), //BigNumber to hex
        //         creator: item[3],
        //         projectId: item[4],
        //         investor: item[5],
        //         contributors: item[6] 
        //   }));
        // setMyProjects(cleanData) 

        const formattedData = proj.map(entry => ({
            title: entry[0],
            description: entry[1],
            amount: parseInt(entry[2].hex, 16), // Convert BigNumber hex to decimal
            creator: entry[3],
            stake: ethers?.BigNumber.from(entry[2]).toString(),
            transactionHash: entry[4],
            recipient: entry[5],
            metadata: entry[6]
        }));

        const jsonFormat = JSON.stringify(formattedData, null, 2)
        setMyProjects(JSON.parse(jsonFormat) || []) 
        // console.log("From my new proj", myproject?.map((item, index) => item.title))
        }
         }
         
    useEffect(() => {
            fetchAllProjects()
            fetchMyprojects()
          },[reloadTrigger])

    return {projects, myproject, refresh:fetchAllProjects,
      refreshfetchMyprojects:fetchMyprojects, refreshAllProjects:fetchAllProjects}
}