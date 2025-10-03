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
  import {useDispatch, useSelector} from 'react-redux';
  import { resetStatus } from '../redux/projects/projectReducers'; 
  import {createProject} from '../redux/projects/projectActions'
  import { Button } from "@/components/ui/button"
  import { Card, CardContent } from "@/components/ui/card"
  import { Textarea } from "@/components/ui/textarea"
  import { Label } from '@/components/ui/label';
  import { Input } from "@/components/ui/input";
  import { useFormik } from 'formik';
  import { useToast } from "@/hooks/use-toast";
  import * as Yup from 'yup';

import { useEffect } from "react"

  export function AlertCreateProject({bg, text}) {
    const {toast} = useToast();
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.projects);
    
    const handleShowToast = (title, description, type) => {
        toast({
          title: title,
          description: description,
          duration: 5000, //10 seconds (default is 5s)
          className: type === "success" ? "bg-custom-gradient text-green-200 font-semibold" : "bg-red-500 text-white",
        });
      };

    useEffect(() => {
        if (success) {
        handleShowToast("Congratulations ✔️", "Your project has been created successfully", "success");
        dispatch(resetStatus()); // clear status after handling
        }

      if (error) {
        handleShowToast("Error ❌", error, "error");
        dispatch(resetStatus());
      }
        
    },[success, error, dispatch])


    const formik = useFormik({
      initialValues: {
        projectTitle: '',
        description: '',
        stakeInput: '',
      },
  
      validationSchema: Yup.object({
        projectTitle: Yup.string().required('Add a project title')
          .max(50, 'Title must be 50 characters or less'),
          description: Yup.string().required('Add a project description'),
        stakeInput: Yup.number().required("This field is required").typeError("Must be an integer value").positive('Stake must be greater than zero'),
      }),

      onSubmit: async (values, {resetForm}) => {
        dispatch(createProject({
        title: values.projectTitle,
        description: values.description,
        stake: values.stakeInput,
          }));
      resetForm()
      },
    });


    return (
      <AlertDialog >
        <AlertDialogTrigger asChild>
        <button style={bg} className="bg-custom-gradient lg:mt-20  px-7 py-3 w-fit rounded-full my-5 ">
                  {text}
                </button>  
        </AlertDialogTrigger>
        <AlertDialogContent >
          <AlertDialogHeader className="mb-1">
            <AlertDialogTitle>Create A New Project</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to create a new project instance
            </AlertDialogDescription>
            <form onSubmit={formik.handleSubmit} className=" w-full text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Create a New Project</h2>
            <Card className="bg-custom-gradient border-none m-1 shadow-lg">
            <CardContent>
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
                    style={{ background: '#22305e', border: '1px solid #234080' }}
                />
                {formik.touched.projectTitle && formik.errors.projectTitle ? (
                    <p className="text-red-300 text-left text-xs mt-1">{formik.errors.projectTitle}</p>
                ) : null}
                </div>

            <div className="mb-3">
              <Label className="block text-white text-left mb-3">Project Description</Label>
              <Textarea
                placeholder="Describe your project"
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

                <div className="mb-3">
                <Label htmlFor="project-stake" className="block text-left text-white mb-2 text-sm font-medium">
                    Stake
                </Label>
                <Input
                    id="stake-input"
                    name="stakeInput"
                    value={formik.values.stakeInput}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter project stake"
                    className="p-5 text-gray-300"
                    style={{ background: '#22305e', border: '1px solid #234080' }}
                />
                {formik.touched.stakeInput && formik.errors.stakeInput ? (
                    <p className="text-red-300 text-left text-xs mt-1">{formik.errors.stakeInput}</p>
                ) : null}
                </div>
                { loading ?
                 <Button disabled type="button">Creating...</Button> 
                : 
                <Button type="submit">Submit a project</Button> }

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
  