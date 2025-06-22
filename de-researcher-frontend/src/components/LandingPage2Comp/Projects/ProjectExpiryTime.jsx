import React, { useEffect, useState } from 'react'
import { Separator } from "@/components/ui/separator"


const ProjectExpiryTime = ({numOfdays}) => {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + numOfdays);

  const calculateTimeLeft = () => {
    const now = new Date()
    console.log(now)
    const total = expiryDate - now;

    if(total <= 0) {
      return{
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      };
    }

    return{
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor(( total % (1000 * 60)) / 1000),
      total,
    }
}

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const tick = () => {

      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      if (updatedTimeLeft.total <= 0) {
        clearInterval(intervalId);
      }
    };
    
    const intervalId = setInterval(tick, 1000)
    tick()

    return () => clearInterval(intervalId)
  },[])



  return (
    <div className='w-full p-8'>
      <div>
        <h1> This Project will end in the next:</h1>
      </div>
      <Separator className="my-4 w-80" />
        {
          timeLeft.total > 0 ? (
          <div className='flex h-5 items-center justify-start space-x-4 text-sm'>
             <div className='flex flex-col'>
              {timeLeft.days}
              <span>Days</span>
            </div>
            {/** Divider starts */}
            <Separator orientation="vertical" />
            {/** Divider ends */}

            <div className='flex flex-col'>
              {timeLeft.hours}
              <span>Hours</span>
            </div>
            {/** Divider starts */}
            <Separator orientation="vertical" />
            {/** Divider ends */}
            <div className='flex flex-col'>
              {timeLeft.minutes}
              <span>Minutes</span>
            </div>
              {/** Divider starts */}
              <Separator orientation="vertical" />
            {/** Divider ends */}
            <div className='flex flex-col'>
              {timeLeft.seconds}
              <span>Seconds</span>
            </div>
      
          </div>
          )
          :
          (
            <span>Expired</span>
          )
        }        

    </div>
  )
}

export default ProjectExpiryTime


// export function SeparatorDemo() {
//   return (
//     <div>
//       <div className="space-y-1">
//         <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
//         <p className="text-sm text-muted-foreground">
//           An open-source UI component library.
//         </p>
//       </div>
//       <Separator className="my-4" />
//       <div className="flex h-5 items-center space-x-4 text-sm">
//         <div>Blog</div>
//         <Separator orientation="vertical" />
//         <div>Docs</div>
//         <Separator orientation="vertical" />
//         <div>Source</div>
//       </div>
//     </div>
//   )
// }
