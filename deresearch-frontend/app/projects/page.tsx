'use client';

import React from 'react';
import Link from 'next/link';
import CountDown from '../_components/countDown';
import ConnectWalletHero from '../_components/hero/connectWalletHero';
import Research from '../_components/research/research';
// Define the structure of each data type
interface ProjectInfoItem {
  head: string;
  data: string;
}

interface ContributionItem {
  step: string;
  type: string;
  contributors: string;
  rwa: string;
  status: boolean;
}

const Projects: React.FC = () => {
  // Example static data (could later be fetched or typed as props)
  const projectInfo: ProjectInfoItem[] = [
    { head: 'Date Created', data: '21st August, 2024' },
    { head: 'Deadline', data: '21st October, 2024' },
    { head: 'Token Incentive Pool', data: '3,000,000 RWA' },
    { head: 'Token Available', data: '1,200,000 RWA' },
    { head: 'Total Researchers', data: '30' },
    { head: 'Token Earned', data: '250 RWA' },
  ];

  const contributions: ContributionItem[] = [
    {
      step: '1',
      type: 'Scalability',
      contributors: '20 contributors',
      rwa: '250',
      status: false,
    },
    {
      step: '2',
      type: 'Security in Decentralized Voting',
      contributors: '20 contributors',
      rwa: '250',
      status: true,
    },
    {
      step: '3',
      type: 'User privacy in Decentralized Voting',
      contributors: '—',
      rwa: '250',
      status: true,
    },
    {
      step: '4',
      type: 'Transparency in Decentralized Voting',
      contributors: '—',
      rwa: '250',
      status: true,
    },
  ];

  return (
    <div className='bg-gradient-to-b from-[#0e1d32] to-[#081529] w-full'>
        <ConnectWalletHero />
        <Research />
        <div className="w-full flex flex-col justify-center mb-20">
        {/* Hero Section */}
        <div
            className="w-[90%] relative m-auto flex flex-col mt-36 items-center justify-center text-gray-50 rounded-2xl"
            style={{ border: '1px solid #FFFFFF14', backgroundColor: '#FFFFFF0A' }}
        >
            {/* ✅ Fixed Link for Next.js */}
            <Link href="/" className="absolute text-white flex items-center -top-10 left-0">
            <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                d="M13.5603 5.22217C14.051 5.22217 14.449 5.62017 14.449 6.11084C14.449 6.35617 14.3496 6.57817 14.189 6.7395L10.373 10.5555L14.189 14.3715C14.3436 14.5315 14.4383 14.7488 14.4383 14.9888C14.4383 15.4795 14.0403 15.8775 13.5496 15.8775C13.3096 15.8775 13.0916 15.7822 12.9316 15.6275L8.48764 11.1835C8.32698 11.0228 8.22697 10.8002 8.22697 10.5548C8.22697 10.3095 8.32631 10.0875 8.48764 9.92617L12.9323 5.4815C13.093 5.32084 13.3143 5.22084 13.5596 5.22084C13.5603 5.22084 13.5603 5.22084 13.561 5.22084L13.5603 5.22217Z"
                fill="white"
                />
            </svg>
            <span className="ml-1">Back Home</span>
            </Link>

            {/* Header Section */}
            <section className="flex flex-col md:flex-row justify-between items-center w-full px-6 pt-5 mb-4">
            <button className="bg-[#42A9E3] text-sm p-2 rounded-full">
                Blockchain & Cryptocurrency
            </button>

            <span className="text-center md:text-left">
                <h2 className="text-lg">Status</h2>
                <button className="text-[#42E3DF] text-sm">IN PROGRESS</button>
            </span>
            </section>

            {/* Project Overview */}
            <section className="flex flex-col lg:flex-row gap-8 mb-8 px-10 w-full">
            <div className="pt-5 text-left w-full lg:w-[80%]">
                <h1 className="text-2xl text-center lg:text-left w-full mb-4 text-white font-bold">
                Developing a Secure and Scalable Blockchain-Based Voting System for Election Integrity
                </h1>
                <p className="text-white/80 text-sm leading-relaxed">
                This research explores a decentralized voting system leveraging blockchain for secure
                and transparent elections. The project focuses on:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80 text-sm space-y-1">
                <li>Scalability</li>
                <li>Security</li>
                <li>User privacy</li>
                <li>Transparency</li>
                </ul>
            </div>

            {/* Project Info Section */}
            <div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4 rounded-lg"
                style={{ border: '1px solid #FFFFFF14' }}
            >
                {projectInfo.map((item, index) => (
                <div key={index} className="flex flex-col p-2">
                    <span className="text-white text-[15px] font-semibold">{item.head}</span>
                    <span className="text-white/70 text-[12px] mt-2">{item.data}</span>
                </div>
                ))}
            </div>
            </section>

            {/* Contribution Section */}
            <section className="w-[95%] flex flex-col justify-center mb-8">
            <h2 className="mb-3 text-lg font-semibold text-white">Submit your contribution</h2>

            <div className="flex flex-col gap-4">
                {contributions.map((item, index) => (
                <div
                    key={index}
                    className="w-full bg-[#FFFFFF0A] rounded-xl flex justify-between p-5 items-center"
                >
                    <div className="text-white/70">{item.step}.</div>

                    <div className="flex flex-col text-left text-white">
                    <span>{item.type}</span>
                    <span className="text-xs text-white/60">{item.contributors}</span>
                    </div>

                    <div className="text-white">{item.rwa} RWA</div>

                    <div>
                    {item.status ? (
                        <button
                        className="p-2 rounded-full text-sm lg:text-base"
                        style={{ border: '1px solid #42E3DF' }}
                        >
                        Submit Contribution
                        </button>
                    ) : (
                        <span className="text-orange-400">Closed</span>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </section>

            {/* Expiry Section */}
            <section className="w-full mt-10">
            <CountDown numOfdays={30} />
            </section>
        </div>
        </div>
    </div>
    
  );
};

export default Projects;
