'use client';

import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';

// Define prop types
interface ProjectExpiryTimeProps {
  numOfdays: number;
}

// Define state type for countdown
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const CountDown: React.FC<ProjectExpiryTimeProps> = ({ numOfdays }) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + numOfdays);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const total = expiryDate.getTime() - now.getTime();

    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((total % (1000 * 60)) / 1000),
      total,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const tick = () => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      if (updatedTimeLeft.total <= 0) clearInterval(intervalId);
    };

    const intervalId = setInterval(tick, 1000);
    tick(); // initialize immediately

    return () => clearInterval(intervalId);
  }, [numOfdays]);

  return (
    <div className="w-full p-8 text-white">
      <h1 className="text-lg font-semibold mb-2">This project will end in:</h1>

      <Separator className="my-4 w-80" />

      {timeLeft.total > 0 ? (
        <div className="flex items-center justify-start space-x-4 text-center text-sm">
          <div className="flex flex-col">
            <span className="text-xl font-bold">{timeLeft.days}</span>
            <span>Days</span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">{timeLeft.hours}</span>
            <span>Hours</span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">{timeLeft.minutes}</span>
            <span>Minutes</span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">{timeLeft.seconds}</span>
            <span>Seconds</span>
          </div>
        </div>
      ) : (
        <span className="text-orange-400 text-lg font-semibold">Expired</span>
      )}
    </div>
  );
};

export default CountDown;
