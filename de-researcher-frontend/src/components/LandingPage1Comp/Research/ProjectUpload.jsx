import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PlusCircleIcon, UploadIcon } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const CreateProjectForm = React.memo(() => {
  const [milestones, setMilestones] = useState([]);
  const [stake, setStake] = useState([]);
  const [error, setError] = useState({
    errorMileStone: '',
    errorStake: ''
  })
  const [project_milestone, setProject_milestone] = useState({ milestones: [] });

  const [projectFile, setProjectFile] = useState(null)
  const [lineCoords, setLineCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  const milestoneRef = useRef(null);
  const stakeRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      projectTitle: '',
      milestoneInput: '',
      description: '',
      stakeInput: '',
    },

    validationSchema: Yup.object({
      projectTitle: Yup.string()
        .required('Add a project title')
        .max(50, 'Title must be 50 characters or less'),
      milestoneInput: project_milestone.milestones.length === 0 ?
       Yup.string().required("Please add a milestone").max(70, 'Milestone must be 100 characters or less') : Yup.string().max(70, 'Milestone must be 100 characters or less')  ,
      description: Yup.string().required("Please describe your project"),
      stakeInput: Yup.number().typeError("Must be an integer value").positive('Stake must be greater than zero'),
    }),
    onSubmit: (values) => {
      const projectData = {
        title: values.projectTitle,
        description: values.description,
        project_milestone: project_milestone.milestones.length === 0 ? [{}] : project_milestone,
        file: projectFile ? projectFile.name : null,
      };

      console.log(projectData);
      // Send `projectData` to the server via an API request here
    },
  });

  const handleAddMilestone = useCallback(() => {
    if (formik.values.milestoneInput.trim() && formik.values.stakeInput) {
      const newEntry = {
        milestone: formik.values.milestoneInput,
        stake: formik.values.stakeInput
      }
      setStake((prev) => [...prev, formik.values.stakeInput])
      setMilestones((prev) => [...prev, formik.values.milestoneInput])
      setProject_milestone((prevProject) => ({
        ...prevProject,// Keeps the existing properties
        milestones: [...prevProject.milestones, newEntry]
      }))
      // setMilestones((prev) => [...prev, formik.values.milestoneInput]);
      // setStake((prev) => [...prev, formik.values.stakeInput]);
      formik.setFieldValue('milestoneInput', '');
      formik.setFieldValue('stakeInput', '');
    }

  }, [formik]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setProjectFile(file);
    }
  }, []);

  useEffect(() => {
    if(milestoneRef.current && stakeRef.current){
      const stakeBounds = stakeRef.current.getBoundingClientRect();
      const milestoneBounds = milestoneRef.current.getBoundingClientRect();
      

      setLineCoords({
        x1: milestoneBounds.left + milestoneBounds.width / 2,
        y1: milestoneBounds.top + milestoneBounds.height / 2,
        x2: stakeBounds.left + stakeBounds.width / 2,
        y2: stakeBounds.top + stakeBounds.height / 2,
      })
    }
  }, [milestones]);

  return (
  
      <form onSubmit={formik.handleSubmit} className="py-32 md:py-[8rem] w-full flex flex-col justify-center text-white rounded-lg">

        <h2 className="text-2xl font-bold mt-10 ml-5 mb-4">Create a New Project</h2>
        <Card className="bg-custom-gradient2 border-none md:mr-10 md:p-10 m-3 pt-10 md:ml-10 shadow-lg">
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="project-title" className="block text-white mb-2 text-sm font-medium">
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
                <p className="text-red-400 text-sm mt-1">{formik.errors.projectTitle}</p>
              ) : null}
            </div>

            <div className="mb-4">
              <Label className="text-white">Project Description</Label>
              <Textarea
                placeholder="Describe your project"
                className="text-gray-300"
                name="description"
                style={{ background: '#22305e', border: '1px solid #234080' }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
               {formik.touched.description && formik.errors.description ? (
                <p className="text-red-400 text-sm mt-1">{formik.errors.description}</p>
              ) : null}
            </div>
            <div className='mt-10'>
              <h2 className='text-center text-white font-bold text-2xl'>Milestones and the stake</h2>
              <ul className='list-disc'>
                <li className='list-disc text-pink-400'>Add a milestone</li>
                <li className='list-disc text-pink-400'>Add the equivalent stake for each milestone</li>
                <li className='list-disc text-pink-400'>Click the plus Icon to add multiple milestones and its equivalent stakes.</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-10 relative">
              <div className="mb-4" ref={milestoneRef}>
                <Label htmlFor="milestone" className="block text-white mb-2 text-sm font-medium">
                  Milestones
                </Label>
                <div className="flex flex-col items-start gap-2 mb-2">
                  <Input
                    id="milestone"
                    name="milestoneInput"
                    value={formik.values.milestoneInput}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Add a milestone"
                    className="p-5 text-gray-300"
                    style={{ background: '#22305e', border: '1px solid #234080' }}
                  />
                  {formik.touched.milestoneInput && formik.errors.milestoneInput ? (
                  <p className="text-red-400 text-sm">{formik.errors.milestoneInput}</p>
                ) : null}
                </div>
              </div>

              <div className="mb-4" ref={stakeRef}>
                <Label htmlFor="stake" className="block text-white mb-2 text-sm font-medium">
                  Stake
                </Label>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    id="stake"
                    name="stakeInput"
                    type="number"
                    value={formik.values.stakeInput}
                    placeholder="What are you staking for this milestone"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-blue-800 border-blue-600 p-5 text-gray-300"
                    style={{ background: '#22305e', border: '1px solid #234080' }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddMilestone}
                    className="p-5 bg-blue-600 hover:bg-blue-700 focus:border-hidden focus:outline-none rounded-full"
                  >
                    <PlusCircleIcon className="text-white text-3xl w-32" />
                  </Button>
                </div>
                {formik.touched.stakeInput && formik.errors.stakeInput ? (
                  <p className="text-red-400 text-sm mt-1">{formik.errors.stakeInput}</p>
                ) : null}
                <ul className="text-sm text-gray-300">
                  {
                    project_milestone.milestones.map((mileStone, index) => {
                      return(
                        <li>
                          Milestone {index + 1}: <strong className='text-pink-300'>{mileStone.milestone} </strong> {" For Stake Price: "} 
                          <strong className='text-pink-400'>{mileStone.stake}{" RWA"}</strong> 
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            
            </div>

            <div className="mb-4">
              <Label htmlFor="file-upload" className="block mb-2 text-sm font-medium">
                Upload Project (JSON, Text, PDF)
              </Label>
              <div>
                <Button
                  type="button"
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center"
                  onClick={() => document.getElementById('hidden-file-input').click()}
                >
                  <UploadIcon className="text-white mr-2" /> Upload
                </Button>
                <input
                  id="hidden-file-input"
                  type="file"
                  accept=".json,.txt,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {projectFile && (
                <p className="text-sm text-gray-300 mt-2">Uploaded: {projectFile.name}</p>
              )}
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-7 font-bold py-2 px-4 rounded"
              >
                Submit Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
  );
});

export default CreateProjectForm;
