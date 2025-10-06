"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connectWallet } from "../../_lib/utils/wallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { toast } from "sonner"
import * as Yup from "yup";
import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import ResearchProjectABI from "../../truffle_abis/ResearchProject.json";
import { useRouter } from "next/navigation";
interface CreateProjectMileStoneProps {
  bg: string;
  onMilestoneAdded: () => void;
  contractId: string;
  text: string;
}

export function CreateProjectMileStone({
  bg,
  onMilestoneAdded,
  contractId,
  text,
}: CreateProjectMileStoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([]);

  // ✅ Toast Helper
  const handleShowToast = (title: string, description: string, type: "success" | "error") => {
    toast(title,{
      description,
      duration: 5000,
      className:
        type === "success"
          ? "bg-custom-gradient text-green-200 font-semibold"
          : "bg-red-500 text-white",
    });
  };

  const [open, setOpen] = useState(false);



  // ✅ Get Project Milestones
  const getMilestones = async () => {
    try {
      const { contractInstance, signer } = await connectWallet();
      const projectAddress = await contractInstance.getProjectAddress(contractId);
      const projectContract = new ethers.Contract(
        projectAddress,
        ResearchProjectABI.abi,
        signer
      );
      const fetchedMilestones = await projectContract.getAllMilestones();
      setMilestones(
        fetchedMilestones.map((m: any) => ({
          title: m.title,
          description: m.description,
          deadline: Number(m.deadline),
          reward: ethers.formatEther(m.reward),
        }))
      );
      console.log("Milestones: ", fetchedMilestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      handleShowToast("Error ❌", "Failed to load milestones", "error");
    }
  };

  useEffect(() => {
    getMilestones();
  }, [contractId]);

  const milestoneListRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  // ✅ Formik Setup
  const formik = useFormik({
    initialValues: {
      projectTitle: "",
      description: "",
      reward: "",
      deadline: null as number | null,
    },
    validationSchema: Yup.object({
      projectTitle: Yup.string()
        .required("Add a project title")
        .max(50, "Title must be 50 characters or less"),
      description: Yup.string().required("Add a project description"),
      reward: Yup.number()
        .required("Reward is required")
        .typeError("Must be a number")
        .positive("Reward must be greater than zero"),
      deadline: Yup.number()
        .typeError("Date is required")
        .nullable()
        .required("Date is required")
        .test("is-future-date", "Please choose a future date", (value) => {
          if (!value) return false;
          const now = Math.floor(Date.now() / 1000);
          return value > now;
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const { contractInstance, signer } = await connectWallet();
        const projectAddress = await contractInstance.getProjectAddress(contractId);
        const projectContract = new ethers.Contract(
          projectAddress,
          ResearchProjectABI.abi,
          signer
        );

        const { projectTitle, description, deadline, reward } = values;
        const contentHash = ethers.keccak256(
          ethers.toUtf8Bytes(projectTitle)
        );

        // Convert reward to wei
        const rewardWei = ethers.parseEther(reward.toString());

        const tx = await projectContract.addMilestone(
          projectTitle,
          description,
          deadline,
          rewardWei,
          contentHash
        );

        await tx.wait();

        handleShowToast(
          "Congratulations ✔️",
          "Milestone added successfully!",
          "success"
        );

        onMilestoneAdded();
        resetForm();
        getMilestones();
        
        setOpen(false)
      setTimeout(() => {
        document.getElementById("milestone-list")?.scrollIntoView({ behavior: "smooth" });
        // router.push("#milestone-list");
      }, 300);
      
      } catch (error) {
        console.error("Milestone creation error:", error);
        handleShowToast(
          "Error ❌",
          "Something went wrong. Please try again.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          style={{ background: bg }}
          className="lg:mt-20 px-7 py-3 w-fit rounded-full my-5"
        >
          {text}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className="mb-1">
          <AlertDialogTitle>Add a Milestone</AlertDialogTitle>
          <form onSubmit={formik.handleSubmit} className="w-full text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Add Milestone</h2>

            <Card className="bg-custom-gradient border-none m-1 shadow-lg">
              <CardContent>
                {/* Title */}
                <div className="mb-3">
                  <Label
                    htmlFor="project-title"
                    className="block text-left text-white mb-2 text-sm font-medium"
                  >
                    Title
                  </Label>
                  <Input
                    id="project-title"
                    name="projectTitle"
                    value={formik.values.projectTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Milestone title"
                    className="p-5 text-gray-300"
                    style={{ background: "#22305e", border: "1px solid #234080" }}
                  />
                  {formik.touched.projectTitle && formik.errors.projectTitle && (
                    <p className="text-red-300 text-left text-xs mt-1">
                      {formik.errors.projectTitle}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <Label className="block text-white text-left mb-3">Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Describe the milestone"
                    className="text-gray-300"
                    style={{ background: "#22305e", border: "1px solid #234080" }}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-300 text-left text-xs mt-1">
                      {formik.errors.description}
                    </p>
                  )}
                </div>

                {/* Reward + Deadline */}
                <div className="flex gap-2">
                  <div>
                    <Label className="block text-left text-white mb-2 text-sm font-medium">
                      Reward (ETH)
                    </Label>
                    <Input
                      id="reward"
                      name="reward"
                      value={formik.values.reward}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter milestone reward"
                      className="p-5 text-gray-300"
                      style={{ background: "#22305e", border: "1px solid #234080" }}
                    />
                    {formik.touched.reward && formik.errors.reward && (
                      <p className="text-red-300 text-left text-xs mt-1">
                        {formik.errors.reward}
                      </p>
                    )}
                  </div>

                  {/* Deadline */}
                  <div>
                    <Label className="block text-left text-white mb-2 text-sm font-medium">
                      Deadline
                    </Label>
                    <span className="flex relative w-fit">
                      <DatePicker
                        id="deadline"
                        name="deadline"
                        selected={
                          formik.values.deadline
                            ? new Date(formik.values.deadline * 1000)
                            : null
                        }
                        onChange={(date: Date) => {
                          const timestamp = Math.floor(date.getTime() / 1000);
                          formik.setFieldValue("deadline", timestamp);
                        }}
                        onBlur={formik.handleBlur}
                        minDate={new Date()}
                        placeholderText="Select deadline"
                        className="bg-[#22305e] text-gray-300 p-2 rounded-md"
                        dateFormat="Pp"
                      />
                      <CalendarDays color="#fff" className="absolute right-1 top-2" />
                    </span>
                    {formik.touched.deadline && formik.errors.deadline && (
                      <p className="text-red-300 text-left text-xs mt-1">
                        {formik.errors.deadline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Add Milestone"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex items-center gap-3 m-0">
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
