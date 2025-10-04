"use client";

import React, { useState, useEffect } from "react";
import { topicData, topicHeader} from "../../_data/topicData";
import ProjectCard from "../../_components/research/projectCard";
import { AlertCreateProject } from "../../_components/modals/createProject";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects, fetchMyProjects } from "../../_redux/projects/projectActions";
import WalletConnector from "../walletConnector";
import type { AppDispatch, RootState } from "../../_redux/store";
import { Project } from "../../_redux/projects/projectActions";

// ✅ Define prop types for dynamic data (optional, inferred from store)
// interface Project {
//   id?: string;
//   title?: string;
//   description?: string;
//   [key: string]: any;
// }

const Research: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const { myProjects, allProjects, loading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const { isConnected } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(fetchMyProjects());
  }, [dispatch]);

  const handleSubData = (index: number) => {
    setOpenIndex((prev) => (prev === index ? 0 : index));
  };

  return (
    <div id="projects" className="w-full mt-32 py-16 bg-[#0b1a2b]">
      {/* Section Title */}
      <h2 className="text-white font-semibold text-left md:text-[200%] text-2xl ml-6 mb-5">
        Latest Research Projects
      </h2>

      {/* Tabs */}
      <div
        className="flex justify-center p-1 pl-2 gap-2 pr-2 h-[48px] shadow-one md:w-[95%] w-full overflow-hidden"
        style={{ borderBottom: "1px solid #FFFFFF0D" }}
      >
        {topicHeader.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleSubData(index)}
            className="flex flex-col justify-between items-center h-[42px] cursor-pointer"
          >
            <span className="text-white text-[12px] rounded-full p-2">
              {item.title}
            </span>
            <div
              className={
                index === openIndex
                  ? "h-[5px] mb-[1px] w-32 rounded-full"
                  : ""
              }
              style={{
                background:
                  index === openIndex
                    ? "linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)"
                    : "",
              }}
            />
          </div>
        ))}
      </div>

      {/* Project Cards */}
      {topicHeader.map((proj, index) => (
        <React.Fragment key={proj.id}>
          {proj.id === 3 && (
            <ProjectCard
              index={index}
              project={myProjects as Project[]}
              openIndex={openIndex}
            />
          )}
          {proj.id === 2 && (
            <ProjectCard
              index={index}
              project={topicData as Project[]}
              openIndex={openIndex}
            />
          )}
          {proj.id === 1 && (
            <ProjectCard
              index={index}
              project={allProjects as Project[]}
              openIndex={openIndex}
            />
          )}
        </React.Fragment>
      ))}

      {/* Call-to-Action Section */}
      <div
        className="w-[95%] m-auto rounded-lg h-100 p-5 flex flex-col md:flex-row items-center justify-center my-16"
        style={{
          backgroundImage:
            "linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)",
          boxShadow: "0px 13.8px 22.58px 0px #00A3FF17",
        }}
      >
        <div className="w-full text-center md:text-left lg:w-[40%] flex flex-col justify-start">
          <h2 className="text-[150%] md:text-[200%] m-5 text-white">
            Upload a project now
          </h2>

          <div className="mt-5 mb-5 md:mt-20 w-fit">
            {isConnected ? (
              <AlertCreateProject
                bg={{
                  backgroundImage:
                    "linear-gradient(86.03deg, #A5DEFF 3.48%, #FFFFFF 102.21%)",
                }}
                text="Upload Now"
              />
            ) : (
              <WalletConnector />
            )}
          </div>
        </div>

        <div className="mt-5">
          <img
            src="/images/uploadIcon.png"
            alt="upload icon"
            className="max-w-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Research;
