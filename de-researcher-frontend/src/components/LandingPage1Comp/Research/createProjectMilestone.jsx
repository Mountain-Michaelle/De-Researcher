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
  import 'react-datepicker/dist/react-datepicker.css';
  import { connectWallet } from "@/walletUtils/Wallet";
  import { Button } from "@/components/ui/button"
  import { Card, CardContent } from "@/components/ui/card"
  import { Textarea } from "@/components/ui/textarea"
  import { Label } from '@/components/ui/label';
  import { Input } from "@/components/ui/input";
  import { useFormik } from 'formik';
  import { useToast } from "@/hooks/use-toast";
  import * as Yup from 'yup';

import { useEffect, useState } from "react"
import { useProjectData } from "@/walletUtils/hooks/useProjectData";
import { ethers } from "ethers";
import ResearchProjectABI from "../../../truffle_abis/ResearchProject.json"


  export function CreateProjectMileStone({bg, onMilestoneAdded, contractId, text}) {
    const [isLoading, setIsLoading] = useState(null)
    const {triggerReload, fetchAllProjects} = useProjectData()
    const [milstone, setMilestone] = useState([])
    const handleLoadProject = async () => {
         triggerReload()
    }
    const {toast} = useToast();

    const handleMileStone  = async () => {
      const {contractInstance} = await connectWallet()

      const milestone = contractInstance.getProjectAddress(1);

    }

    const handleShowToast = (title, description, type) => {
        toast({
          title: title,
          description: description,
          duration: 5000, //10 seconds (default is 5s)
          className: type === "success" ? "bg-custom-gradient text-green-200 font-semibold" : "bg-red-500 text-white",
        });
      };

    const formik = useFormik({
      initialValues: {
        projectTitle: '',
        description: '',
        reward: '',
        deadline: null
      },
  
      validationSchema: Yup.object({
        projectTitle: Yup.string().required('Add a project title')
          .max(50, 'Title must be 50 characters or less'),
          description: Yup.string().required('Add a project description'),
        reward: Yup.number().required("This field is required").typeError("Must be an integer value").positive('Reward must be greater than zero'),
        deadline: Yup.number().typeError("Date is required").
        nullable().required("Date is required").test("is-future-date", "Please choose a future date",
        (value) => {
          if(!value) return false;
          const nowInSeconds = Math.floor(Date.now() / 1000);
          return value > nowInSeconds;
        })
      }),

      onSubmit: async (values, {resetForm}) => {
        setIsLoading(!isLoading)
        const {contractInstance, signer} = await connectWallet()
        const projectAddress = await contractInstance.getProjectAddress(contractId)
        const projectContract = new ethers.Contract(projectAddress, ResearchProjectABI.abi, signer)
        try{

         const projectData = {
          title: values.projectTitle,
          description: values.description,
          deadline: values.deadline,
          reward: values.reward
        };
        const {title, description, deadline, reward} = projectData
        const contentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(title));
        const tx = await projectContract.addMilestone(title, description, deadline, reward, contentHash)
        await tx.wait()
        handleShowToast("Congratulations ✔️", "You added a milestone successfully", "success")
        onMilestoneAdded()
        setIsLoading(!!isLoading)
        triggerReload()
        resetForm()
        }catch(error){
            setIsLoading(!!isLoading)
            handleShowToast("Error ❌", "Something went wrong, Please try again later", "error")
            console.log("Fatal! ", error)
        }
      },
    });

    const getMileStones = async () => {

      try{
      const {contractInstance, signer} = await connectWallet() 
      const projectAddress = await contractInstance.getProjectAddress(contractId)
      const projectContract = new ethers.Contract(projectAddress, ResearchProjectABI.abi, signer)
      const milestones = await projectContract.getAllMilestones();
      console.log("Milestone ", milestones)
      setMilestone(milestones)
      }
      catch(error) {
        console.log(error, "Getting milesonte error")
        setMilestone(error)
      }
    }

    useEffect(() => {
      getMileStones()
    },[])


    return (
      <AlertDialog >
        <AlertDialogTrigger asChild>
        <Button style={{background: bg}} className="lg:mt-20  px-7 py-3 w-fit rounded-full my-5 ">
                  {text}
        </Button>  
        </AlertDialogTrigger>
        <AlertDialogContent >
          <AlertDialogHeader className="mb-1">
            <AlertDialogTitle>Add a Milestone</AlertDialogTitle>
            <form onSubmit={formik.handleSubmit} className=" w-full text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Add Milestone</h2>
            <Card className="bg-custom-gradient border-none m-1 shadow-lg">
            <CardContent>
                <div className="mb-3">
                <Label htmlFor="project-title" className="block text-left text-white mb-2 text-sm font-medium">
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
                    style={{ background: '#22305e', border: '1px solid #234080' }}
                />
                {formik.touched.projectTitle && formik.errors.projectTitle ? (
                    <p className="text-red-300 text-left text-xs mt-1">{formik.errors.projectTitle}</p>
                ) : null}
                </div>

            <div className="mb-3">
              <Label className="block text-white text-left mb-3">Description</Label>
              <Textarea
                placeholder="Describe the milestone"
                className="text-gray-300"
                name="description"
                style={{ background: '#22305e', border: '1px solid #234080' }}
                onChange={formik.handleChange}
                value={formik.values.description}
                onBlur={formik.handleBlur}
              />
               {formik.touched.description && formik.errors.description ? (
                <p className="text-red-300 text-left text-xs mt-1">{formik.errors.description}</p>
              ) : null}
            </div>
            <div className="flex gap-2">
                 <div className="">
                <Label htmlFor="project-stake" className="block text-left text-white mb-2 text-sm font-medium">
                    Reward
                </Label>
                <Input
                    id="stake-input"
                    name="reward"
                    value={formik.values.reward}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter milestone reward"
                    className="p-5 text-gray-300"
                    style={{ background: '#22305e', border: '1px solid #234080' }}
                />
                {formik.touched.reward && formik.errors.reward ? (
                    <p className="text-red-300 text-left text-xs mt-1">{formik.errors.reward}</p>
                ) : null}
                </div>

                <div className="">
                <Label htmlFor="project-stake" className="block text-left text-white mb-2 text-sm font-medium">
                    Deadline
                </Label>
               <span className="flex relative w-fit">
                <DatePicker 
               id="deadline"
               name="deadline"
              
               selected={formik.values.deadline  ? new Date(formik.values.deadline * 1000) : formik.values.deadline}
               onChange={(value) => {
                const timestamp = Math.floor(value.getTime() / 1000) // Stored as a unix stamp
                formik.setFieldValue('deadline', timestamp)}
              }
               onBlur={formik.handleBlur}
               minDate={new Date()}
               placeholderText="Select deadline"
               className="bg-[#22305e] text-gray-300 p-2 rounded-md"
              // showTimeSelect
              dateFormat="Pp"
               />
                <CalendarDays color="#ffff" className="absolute right-1 top-2"/>
               </span>
               
                {formik.touched.deadline && formik.errors.deadline ? (
                    <p className="text-red-300 text-left text-xs mt-1">{formik.errors.deadline}</p>
                ) : null}
                </div>
            </div>
             
                { isLoading === true ?
                 <Button disable={true} type="button">Creating...</Button> 
                : 
                <Button type="submit">ADD</Button> }

            </CardContent>
            </Card>
            </form>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-3 m-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  