"use client";

import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { resetStatus } from "../../_redux/projects/projectReducers";
import { createProject } from "../../_redux/projects/projectActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner"

import type { RootState, AppDispatch } from "../../_redux/store";

//
// 🔹 Props definition
//
interface AlertCreateProjectProps {
  bg?: React.CSSProperties;
  text: string;
}

//
// 🧩 Component
//
export const AlertCreateProject: React.FC<AlertCreateProjectProps> = ({ bg, text }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector((state: RootState) => state.projects);
  const [open, setOpen] = useState(false)
  //
  // ✅ Toast handling
  //
  const handleShowToast = (title: string, description: string, type: "success" | "error") => {
    toast(title,{
      description:description,
      duration: 5000,
      className:
        type === "success"
          ? "bg-custom-gradient text-green-200 font-semibold"
          : "bg-red-500 text-white",
    });
  };

  //
  // ✅ Success & Error effect
  //
  useEffect(() => {
    if (success) {
      handleShowToast("Congratulations ✔️", "Your project has been created successfully", "success");
      dispatch(resetStatus());
    }
    if (error) {
      handleShowToast("Error ❌", error, "error");
      dispatch(resetStatus());
    }
  }, [success, error, dispatch]);

  //
  // ✅ Formik Setup
  //
  const formik = useFormik({
    initialValues: {
      projectTitle: "",
      description: "",
      stakeInput: "",
    },
    validationSchema: Yup.object({
      projectTitle: Yup.string()
        .required("Add a project title")
        .max(50, "Title must be 50 characters or less"),
      description: Yup.string().required("Add a project description"),
      stakeInput: Yup.number()
        .required("This field is required")
        .typeError("Must be a number")
        .positive("Stake must be greater than zero"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await dispatch(
        createProject({
          title: values.projectTitle,
          description: values.description,
          stake: values.stakeInput,
        })
      );
      resetForm();

      setOpen(false)

      setTimeout(() => {
        document.getElementById("project-view")?.scrollIntoView({ behavior: "smooth" });
        // router.push("#milestone-list");
      }, 300);
    },
  });

  //
  // 🧱 Render
  //
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          style={bg}
          className="bg-custom-gradient lg:mt-20 px-7 py-3 w-fit rounded-full my-5 text-white font-medium"
        >
          {text}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className="mb-1">
          <AlertDialogTitle>Create A New Project</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to create a new project instance
          </AlertDialogDescription>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="w-full text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Create a New Project</h2>

            <Card className="bg-custom-gradient border-none m-1 shadow-lg">
              <CardContent>
                {/* Project Title */}
                <div className="mb-3">
                  <Label htmlFor="project-title" className="block text-left text-white mb-2 text-sm font-medium">
                    Project Title
                  </Label>
                  <Input
                    id="project-title"
                    name="projectTitle"
                    value={formik.values.projectTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter project title"
                    className="p-5 text-gray-300"
                    style={{ background: "#22305e", border: "1px solid #234080" }}
                  />
                  {formik.touched.projectTitle && formik.errors.projectTitle && (
                    <p className="text-red-300 text-left text-xs mt-1">
                      {formik.errors.projectTitle}
                    </p>
                  )}
                </div>

                {/* Project Description */}
                <div className="mb-3">
                  <Label className="block text-white text-left mb-3">Project Description</Label>
                  <Textarea
                    placeholder="Describe your project"
                    className="text-gray-300"
                    name="description"
                    style={{ background: "#22305e", border: "1px solid #234080" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-300 text-left text-xs mt-1">
                      {formik.errors.description}
                    </p>
                  )}
                </div>

                {/* Stake */}
                <div className="mb-3">
                  <Label htmlFor="stake-input" className="block text-left text-white mb-2 text-sm font-medium">
                    Stake/ETH
                  </Label>
                  <Input
                    id="stake-input"
                    name="stakeInput"
                    value={formik.values.stakeInput}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter project stake"
                    className="p-5 text-gray-300"
                    style={{ background: "#22305e", border: "1px solid #234080" }}
                  />
                  {formik.touched.stakeInput && formik.errors.stakeInput && (
                    <p className="text-red-300 text-left text-xs mt-1">
                      {formik.errors.stakeInput}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                {loading ? (
                  <Button disabled type="button">
                    Creating...
                  </Button>
                ) : (
                  <Button type="submit">Submit a project</Button>
                )}
              </CardContent>
            </Card>
          </form>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex items-center gap-3 m-0">
          <AlertDialogCancel onClick={()=>setOpen(false)}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
