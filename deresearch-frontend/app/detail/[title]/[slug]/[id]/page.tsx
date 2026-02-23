"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { shortenAddress } from "../../../../_lib/addresShortener";
import { Button } from "@/components/ui/button";
import { CreateProjectMileStone } from "../../../../_components/research/createProjectMilestone";
import { useParams } from "next/navigation";
import { ethers, Contract } from "ethers";
import { connectWallet } from "../../../../_lib/utils/wallet";
import ResearchProjectABI from "../../../../truffle_abis/ResearchProject.json";
import { BigNumber } from "@ethersproject/bignumber";
import { ChevronsLeft } from "lucide-react";
import { ProjectFiles } from "@/components/project/ProjectFiles";

// --------------------
// 🔹 Type Definitions
// --------------------

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  isCompleted: boolean;
  recipient: string;
  progress: string;
  hash: string;
}

interface ProjectDetails {
  title: string;
  description: string;
  recipient: string;
  transactionHash: string;
  creator: string;
  extras?: string;
  stake?: string;
  participants?: string;
  milestone?: string;
}

interface RawMilestone extends Array<unknown> {
  0: string; // title
  1: string; // description
  2: bigint | string; // amount
  3: bigint | string; // deadline
  4: boolean; // isCompleted
  5: string; // recipient
  6: bigint | string; // progress
  7: string; // hash
}


const ResearchDetails: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams();
  const id = params?.id as string | undefined;
  const milestoneListRef = useRef<HTMLDivElement | null>(null);

  const getMilestones = useCallback(async (projectId: string) => {
    try {
      const { contractInstance, signer } = await connectWallet();
      const projectAddress: string = await contractInstance.getProjectAddress(projectId);
      const projectContract = new Contract(projectAddress, ResearchProjectABI.abi, signer);

      const rawMilestones: RawMilestone[] = await projectContract.getAllMilestones();

      const formattedMilestones: Milestone[] = rawMilestones.map((m, idx) => ({
        id: idx,
        title: String(m[0]),
        description: String(m[1]),
        amount: ethers.formatEther(BigNumber.from(m[2]).toString()),
        deadline: BigNumber.from(m[3]).toString(),
        isCompleted: Boolean(m[4]),
        recipient: String(m[5]),
        progress: BigNumber.from(m[6]).toString(),
        hash: String(m[7]),
      }));

      setMilestones(formattedMilestones);
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching milestones:", err);
      setErrorMessage(err.message || "Error fetching milestones");
    }
  }, []);

  const capitalizeFirst = (str: string): string =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const getProjectDetail = useCallback(async (projectId: string) => {
    try {
      setIsLoading(true);
      const { contractInstance } = await connectWallet();
      const resp = await contractInstance.getProjectDetails(projectId);
      console.log("projectDetails", resp)
      const raw = Array.isArray(resp) ? resp[0] : [];

      if (Array.isArray(raw) && raw.length > 0) {
        const formatted: ProjectDetails = {
          title: String(raw[0]),
          stake:String([raw[2]]),
          description: String(raw[1]),
          recipient: String(raw[3]),
          transactionHash: String(raw[4]),
          creator: String(raw[5]),
          extras: String(raw[7] ?? ""),
        };
        setProjectDetails(formatted);
      }
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Error fetching project details");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getProjectDetail(id);
      getMilestones(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, getProjectDetail, getMilestones]);


  return (
    <div className="min-h-screen w-full bg-gray-900 text-white relative">
      {isLoading && (
        <div className="w-full h-full absolute flex justify-center items-center bg-black bg-opacity-30">
          <img src="/images/eclipse.gif" alt="Loading..." className="w-[200px] h-[200px]" />
        </div>
      )}

      <div className="w-full mt-28 bg-gray-800 p-6 rounded-lg shadow-lg">
        {projectDetails ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-400">{projectDetails.title}</h1>
                <p className="text-gray-400 mt-2">
                  By: {shortenAddress(projectDetails.creator)}
                </p>
              </div>

              <CreateProjectMileStone
                onMilestoneAdded={() => id && getMilestones(id)}
                text="Add Milestones"
                bg="bg-custom-gradient2"
                contractId={id || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-gray-400">Total Tokens Committed</p>
                <p className="text-xl font-semibold">{projectDetails.stake || "0"} Wei</p>
              </div>
              <div>
                <p className="text-gray-400">Total Participants</p>
                <p className="text-xl font-semibold">{projectDetails.participants || 0} of 300</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-400">Description</p>
              <p className="text-sm w-9/12 bg-gray-700 bg-opacity-65 text-justify break-all p-5 rounded">
                {projectDetails.description}
              </p>
            </div>

            {id && <ProjectFiles projectId={id} />}

            <div className="mt-6">
              <p className="text-gray-400">Transaction Hash</p>
              <p className="text-sm break-all bg-gray-700 p-2 rounded">
                {shortenAddress(projectDetails.transactionHash, 8)}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-gray-400">Recipient</p>
              <p className="text-sm break-all bg-gray-700 p-2 rounded">
                {shortenAddress(projectDetails.recipient, 10)}
              </p>
              <div ref={milestoneListRef} className="m-0 p-0" id="milestone-list" />
            </div>

            <Button
              className="mt-6 w-fit bg-custom-gradient hover:bg-blue-600 text-white py-2 rounded-lg transition"
              onClick={() => window.history.back()}
            >
              <ChevronsLeft />
              Go Back
            </Button>

            {/* Milestones Section */}
            <div className="mt-16">
              <div ref={milestoneListRef} id="milestone-list" />
              <h2 className="text-3xl md:text-4xl font-semibold text-blue-400 mb-4">MILESTONES</h2>
              {milestones.length > 0 ? (
                <div className="space-y-4 flex flex-wrap gap-5">
                  {[...milestones].reverse().map((m) => (
                    <div key={m.id} className="bg-gray-700 max-w-[80%] relative p-4 rounded-lg">
                      <h3 className="text-blue-200 font-bold mt-3 text-xl">
                        {capitalizeFirst(m.title.toLowerCase())}
                      </h3>
                      <p className="text-gray-300 ml-2">{m.description}</p>
                      <p className="text-sm ml-2">Amount: {m.amount} ETH</p>
                      <p
                        className={`text-sm absolute top-0 right-3 mt-4 ${
                          m.isCompleted ? "text-green-400" : "text-yellow-400"
                        }`}
                      >
                        {m.isCompleted ? "Completed" : "Pending"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-400">No milestones added yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-red-400 mt-12">
            {errorMessage || "No project details found."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResearchDetails;
