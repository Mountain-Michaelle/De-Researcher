"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { shortenAddress } from "../../_lib/addresShortener";
import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";
import { BigNumberish } from "ethers";
import { Project } from "@/app/_redux/projects/projectActions";
// ---------------------
// ✅ Type Definitions
// ---------------------
// export interface Project {
//   projectId: string | BigNumberish;
//   title: string;
//   creator: string;
//   stake?: string | number;
//   date?: string;
// }

interface ProjectCardProps {
  project: Project[];
  index: number;
  openIndex: number;
}

// ---------------------
// ✅ Component
// ---------------------
const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, openIndex }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const handleSelectNavigate = (
    clickedProjectId: string | BigNumberish,
    title: string,
    creator: string
  ) => {
    // Find the projectId from the project list
    const matched = project.find((p) => p.projectId === clickedProjectId);

    if (!matched) return;

    const projectIdStr = String(matched.projectId);
    setSelectedIds([projectIdStr]);

    // ✅ Navigate using Next.js router
    router.push(
      `/detail/${encodeURIComponent(title)}/${encodeURIComponent(creator + creator + projectIdStr)}/${projectIdStr}`
    );
  };

  return (
    <div
      className={
        openIndex === index
          ? "flex flex-wrap gap-4 m-4 justify-center"
          : "hidden"
      }
    >
      {Array.isArray(project) &&
        project.map((projData, idx) => (
          <div
            key={idx}
            className="animate-in slide-in-from-right duration-500 bg-[#112240] p-6 rounded-lg md:w-[48%] w-full"
          >
            <div>
              <h4 className="text-white text-2xl">{projData.title}</h4>

              <span className="flex justify-between mt-6">
                <p className="text-sm text-gray-400">
                  By: {shortenAddress(projData.creator)}
                </p>
                <p className="mt-1 text-sm text-gray-400">{projData.title}</p>
              </span>

              <div className="relative w-full h-0.5 bg-gray-700 rounded mt-3">
                <div
                  className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between mt-6 space-x-8">
              <div>
                <div className="text-xs text-white/50">
                  Total Tokens Committed
                </div>
                <p className="font-bold text-white text-xl">
                  {projData.stake ?? 0} <small>Wei</small>
                </p>
                <div className="mt-2 text-white text-sm">Milestone</div>
              </div>

              <div>
                <div className="text-xs text-white/55">Total Participants</div>
                <p className="font-bold text-white text-xl">2392</p>
                <div className="mt-2 text-white text-sm">23 of 300</div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-gray-700 rounded-full my-5"></div>

            <div className="flex justify-end">
              <Button
                onClick={() =>
                  handleSelectNavigate(
                    projData.projectId,
                    projData.title,
                    projData.creator
                  )
                }
                className="bg-custom-gradient border-none text-gray-200"
              >
                View More <ChevronsRight className="ml-1" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProjectCard;
