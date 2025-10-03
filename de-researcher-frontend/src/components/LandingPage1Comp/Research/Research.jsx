"use client"
import React, { useState, useEffect} from 'react'
import { topicData} from './topic'
import { topicHeader } from './topicHeader'
import ProjectCard from './ProjectCard'
import { AlertCreateProject } from '@/walletUtils/createProject'
import { useProjectData } from '@/walletUtils/hooks/useProjectData'
import {useDispatch, useSelector} from "react-redux";
import {fetchAllProjects, fetchMyProjects} from "../../../redux/projects/projectActions";

function Research() {

    const [openIndex, setOpenIndex] = useState(0)
    const dispatch = useDispatch();
    const  {myProjects, allProjects,  loading, error} = useSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchAllProjects())
        dispatch(fetchMyProjects())
    },[dispatch])

    console.log("my projects", myProjects)

    const handleSubData = (index) => {
        if(openIndex === index){
            setOpenIndex(0)
        }else{
            setOpenIndex(index)
        }
    } 

  return (
    //   {/* Latest Projects */}
      <div id="projects" className="w-full mt-32 py-16 bg-[#0b1a2b]">
        <h2 className="text-white font-semibold text-left md:text-[200%] text-2xl sm:text-[200%] lg:[50%]  ml-6 mb-5">Latest Research Projects</h2>

        <div className='flex justify-center p-1 pl-2  gap-2 pr-2 h-[48px] shadow-one md:w-[95%] w-full
         sm:[100%] lg:[50%] overflow-hidden'
        style={{borderBottom: '1px solid #FFFFFF0D'}}
        >
            {
                topicHeader.map((item, index) => {
                    return(
                        <div onClick={() => handleSubData(index)} className='flex flex-col justify-between items-center h-[42px] p-0 m-0'>  
                            <span className='text-white text-[12px] cursor-pointer 
                             overflow-hidden rounded-full border-hidden p-2 border-inherit'>
                            {item.title}
                            </span>
                            <div className={index === openIndex ? "h-[5px] mb-[1px] w-32 rounded-full" : ''}
                            style={{background: `${index === openIndex ? 'linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)' : '' }`}}>

                            </div>
                        </div>
                    )
                })
            }
        </div>
        
        
          {topicHeader.map((proj, index) => (
            <>
            {
                proj.id === 3 && <ProjectCard index={index} project={myProjects} openIndex={openIndex} />
            }
            
            {
                proj.id === 2 && <ProjectCard index={index} project={topicData} openIndex={openIndex} />
            }

            {
                proj.id === 1 && <ProjectCard index={index} project={allProjects} openIndex={openIndex} />
            }
            </>

          
          ))}
              


        <div className='w-[95%] m-auto rounded-lg h-100 p-5 flex flex-col md:flex-row items-center justify-center my-16' 
        style={{backgroundImage: 'linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)', 
        boxShadow: '0px 13.8px 22.58px 0px #00A3FF17'}}>
            <div className='w-full text-center md:text-left lg:w-[40%] flex flex-col justify-start' >
                <h2 className='text-[150%] md:text-[200%] m-5 text-white space-x-'>
                Upload a project now
                </h2>
                <div className=' mt-5 mb-5 md:mt-20 w-fit'
                >
                    <AlertCreateProject
                     bg={{backgroundImage: 'linear-gradient(86.03deg, #A5DEFF 3.48%, #FFFFFF 102.21%)'}} text={"Uplaod Now"}/>
                </div>    

            </div>

            <div className='mt-5' >
                <img src='/images/uploadIcon.png' alt='wallet' width={'100%'} />
            </div>
        </div>
      </div>
  )
}

export default Research