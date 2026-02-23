"use client";
import React from "react";
import { AlertCreateProject } from "../../_components/modals/createProject";
import WalletConnector from "../walletConnector";
import { useSelector } from "react-redux";
import type { RootState } from "../../_redux/store"; 
const ConnectWalletHero: React.FC = () => {
  const { isConnected } = useSelector((state: RootState) => state.wallet);

  return (
    <div className="w-full flex flex-col lg:flex-row mx-1 pt-24 items-center justify-center text-gray-50">
      {/* Text Section */}
      <div className="flex flex-col items-center p-4 lg:items-start my-2 w-full lg:w-[50%] justify-center">
        <h1 className="text-3xl text-center lg:text-left md:text-5xl text-white font-bold">
          Decentralized Project Research Platform
        </h1>

        <p className="text-md lg:text-lg text-center ml-0 mb-0 lg:text-left mt-4">
          Access over 160 million publication pages and stay up to date with
          what&apos;s happening in your field.
        </p>

        <div>
          {isConnected ? (
            <AlertCreateProject
              bg={{
                backgroundImage:
                  "linear-gradient(83.07deg, #5200FF 6.18%, #2C86D9 97%)",
              }}
              text="Submit a Project"
            />
          ) : (
            <div className="mt-8">
              <WalletConnector bgStyle="#361b83f0" />
            </div>
          )}
        </div>
      </div>

      {/* Image Section */}
      <div className="h-[200px] w-[400px] mt-16 lg:w-[40%] bg-cover bg-center relative">
        <img
          src="/images/Vector.png"
          alt="decorative vector"
          className="absolute right-0 p-5 w-[350px] h-[300px] -top-10 lg:right-0"
        />
        <img
          src="/images/explore2.svg"
          alt="explore illustration"
          className="object-cover absolute z-10 -top-20 lg:right-0 right-7 w-[85%] lg:w-[350px]"
        />
      </div>
    </div>
  );
};

export default ConnectWalletHero;
