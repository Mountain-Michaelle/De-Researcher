import { connectWallet } from "../../walletUtils/Wallet";
import { ethers } from "ethers";
import {createAsyncThunk} from "@reduxjs/toolkit";
export const fetchMyProjects = createAsyncThunk(
    "projects/fetchMyProjects",
    async (_, thunkAPI) => {
        try{
            const {contractInstance, address} = await connectWallet()
            const proj = await contractInstance.getProjectsByCreator(address)
            
            if(Array.isArray(proj) && proj.length > 0){
            const formattedData = proj.map(entry => ({
            title: entry[0],
            description: entry[1],
            amount: parseInt(entry[2].hex, 16), // Convert BigNumber hex to decimal
            creator: entry[3],
            stake: ethers?.BigNumber.from(entry[2]).toString(),
            transactionHash: entry[4],
            recipient: entry[5],
            projectId: ethers?.BigNumber.from(entry[6]).toString(),
            metadata: entry[6]
        }));

        const jsonFormat = JSON.stringify(formattedData, null, 2)
        return JSON.parse(jsonFormat) || []
        // console.log("From my new proj", myproject?.map((item, index) => item.title)
         }
        }catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const fetchAllProjects = createAsyncThunk(
    "projects/fetchAllProjects",
    async (_, thunkAPI) => {
        try{
            const {contractInstance} = await connectWallet()
            const proj = await contractInstance.getAllProjects()

             if(proj.length > 0){
                        const cleanData = proj[0].map(item => ({
                          title: item[0], 
                          description: item[1],
                          stake: ethers?.BigNumber.from(item[2]).toString(), //BigNumber to hex
                          creator: item[3],
                          projectId: ethers.BigNumber.from(item[6]).toString() ,
                          investor: item[5],
                          contributors:item[4]
                      }));
                      
                        const lastFourProject = cleanData.slice(-4).reverse()
                        // setContractAddress(cleanData.contractAddress)
                    return Array.isArray(lastFourProject) ? lastFourProject : [] // Forced into Array
                        
                      }else{
                        return [];
                      } 
        }catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const createProject = createAsyncThunk(
    "project/createProject",
    async ({title, description, stake}, thunkAPI) => {

        try{
            const { contractInstance } = await connectWallet();
            const tx = await contractInstance.createResearchProject(title, description, stake)
            await tx.wait()
            thunkAPI.dispatch(fetchMyProjects())
            thunkAPI.dispatch(fetchAllProjects())
        }catch(error){
            thunkAPI.rejectWithValue(error.message)
        }
    }
)
