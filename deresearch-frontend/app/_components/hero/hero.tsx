import React from "react";
import Hero2 from "./hero2";
import { tokenData } from "../../_data/tokenData";
import GetStarted from "./getStarted";

const Hero: React.FC = () => {  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center text-gray-50">
        <div className="flex flex-col items-center lg:items-start justify-center w-full py-20 lg:w-1/2 lg:space-x-3">
          <h1 className="text-2xl md:text-4xl lg:text-5xl text-center lg:text-left font-bold text-white leading-tight">
            Empower Research, Reward Innovation
          </h1>
          <p className="text-lg text-gray-300 text-center lg:text-left mt-4 max-w-lg">
            Submit your project topics, incentivize research, and unlock progress with the
            power of blockchain.
          </p>

          <div className="mt-6">
            <GetStarted />
          </div>
        </div>

        <div className="hidden lg:flex justify-center items-center w-full lg:w-[40%] relative h-96 overflow-hidden">
          <img
            src="/images/explore2.svg"
            className="object-cover z-20 absolute w-[400px]"
            alt="explore 2"
          />
          <img
            src="/images/explore.svg"
            className="object-cover z-10 absolute -right-10 -bottom-20"
            alt="explore background"
          />
        </div>
      </div>

      {/* Hero secondary section */}
      <Hero2 />

      {/* Supported Tokens */}
      <section className="bg-[#0b1a2b] text-center text-white py-10">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Supported Networks / Tokens
        </h2>
        <div className="flex justify-center flex-wrap gap-8 mt-8 px-8">
          {tokenData.map((token) => (
            <img
              key={token.name}
              src={token.image}
              alt={token.name}
              className="w-10 h-10 object-contain mx-auto"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
