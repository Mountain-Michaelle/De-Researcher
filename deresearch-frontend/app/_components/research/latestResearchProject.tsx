'use client';

import Image from 'next/image';
import React from 'react';
import { topicData } from '@/app/_data/latestResearchTopic';
import WalletConnector from '../walletConnector';
import { Topic } from '@/app/_data/topicData';/**
 * A section displaying recent research projects and a wallet connection CTA.
 */
const LatestResearchProject: React.FC = () => {
  return (
    <div id="projects" className="w-full py-16 bg-[#0b1a2b]">
      {/* Header */}
      <h2 className="text-white font-semibold text-left md:text-[200%] text-2xl ml-6 mb-5">
        Latest Research Projects
      </h2>

      {/* Topics Bar */}
      <div
        className="flex justify-between p-1 pl-2 pr-2 h-[48px] bg-[#FFFFFF0D] md:w-[95%] w-full rounded-3xl m-auto overflow-hidden"
        style={{ border: '1px solid #FFFFFF0D' }}
      >
        {topicData.map((topic: Topic, index: number) => (
          <button
            key={topic.title}
            className="text-white pl-3 pr-3 text-[12px] rounded-full transition-all duration-300"
            style={{
              backgroundImage:
                index === 0
                  ? 'linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)'
                  : 'none',
            }}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div
        className="flex gap-4 m-4 flex-wrap justify-center"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-[#112240] p-6 rounded-lg md:w-[48%] w-full"
          >
            <h4 className="text-sm text-white">
              Blockchain-based Voting System
            </h4>

            <div className="flex justify-between mt-14 text-gray-400 text-sm">
              <p>By: Jonny Gabriela</p>
              <p>July, 2024</p>
            </div>

            <div className="relative w-full h-2 bg-gray-700 rounded-full mt-4">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5200FF] to-[#2C86D9] rounded-full"
                style={{ width: '45%' }}
              />
            </div>

            <div className="flex justify-between mt-6 text-white">
              <div>
                <div className="text-xs text-white/50">Total Tokens Committed</div>
                <p className="font-bold text-xl">200,000 RWA</p>
                <div className="mt-2 text-white text-sm">Milestone</div>
              </div>
              <div>
                <div className="text-xs text-white/50">Total Participants</div>
                <p className="font-bold text-xl">2392</p>
                <div className="mt-2 text-white text-sm">23 of 300</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wallet Connect Section */}
      <div
        className="w-[95%] m-auto rounded-lg flex flex-col md:flex-row items-center justify-center my-16 p-6"
        style={{
          backgroundImage:
            'linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)',
          boxShadow: '0px 13.8px 22.58px 0px #00A3FF17',
        }}
      >
        <div className="w-full md:w-[40%] text-center md:text-left">
          <h2 className="text-[200%] mt-6 md:mt-0 text-white">
            Connect your wallet to get started
          </h2>

          <div className="mt-4">
            <WalletConnector
              title="Connect your wallet"
              bgStyle="linear-gradient(86.03deg, #A5DEFF 3.48%, #FFFFFF 102.21%)"
              textColor="black"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8 md:mt-0">
          <Image
            src="/images/wallet.png"
            alt="Wallet"
            width={350}
            height={250}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LatestResearchProject;
