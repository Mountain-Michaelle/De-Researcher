"use client"; // ✅ ensures this runs on the client (for Tailwind + dynamic rendering)

import Image from "next/image";
import React from "react";
import { pageData1 } from "../_data/pageData";

interface Step {
  step: string;
  title: string;
  description: string;
}

interface Feature {
  image: string;
  title: string;
  description: string;
}



const Featured: React.FC = () => {
  const steps: Step[] = [
    {
      step: "Step 1",
      title: "Submit Your Research Project",
      description:
        "Create a project proposal with clear requirements. Commit a number of tokens as rewards to attract researchers from our community.",
    },
    {
      step: "Step 2",
      title: "Contribute to Research",
      description:
        "Contributions are made to fulfill the project's requirements, with tokens distributed based on the quality and depth of each contribution.",
    },
    {
      step: "Step 3",
      title: "Verify & Earn",
      description:
        "Other researchers in the community verify the contributions. Verification is rewarded with additional tokens, ensuring quality control and maintaining research standards.",
    },
  ];

  return (
    <div className="bg-[#112240]">
      <section id="how-it-works" className="py-16 bg-[#112240]">
        <h2 className="text-[200%] sm:text-3xl font-semibold text-white ml-5 mb-5 text-left">
          How it works
        </h2>

        <div className="flex flex-col md:flex-row justify-center md:mx-10 gap-8 mt-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-lg w-full md:w-1/3 bg-[#FFFFFF0D]"
              style={{
                background:
                  "linear-gradient(177.42deg, rgba(255, 255, 255, 0.05) 2.32%, rgba(255, 255, 255, 0) 98.02%)",
              }}
            >
              <h3 className="text-lg font-bold bg-blue-500 text-blue-500 text-center w-fit p-2 rounded-md">
                {item.step}
              </h3>
              <h4 className="mt-4 text-xl text-white font-semibold">{item.title}</h4>
              <p className="mt-2 text-white text-xs">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------- Features ------------------------------ */}
      <section className="py-16 bg-[#112240]">
        <h2 className="text-white text-[220%] font-semibold text-left ml-5">
          Features
        </h2>

        <div className="flex flex-wrap gap-4 justify-center m-4">
          {pageData1.map((feature: Feature, index: number) => (
            <div
              key={index}
              className="flex p-7 rounded-lg justify-start space-x-2 items-center md:w-[48%] w-full"
              style={{
                background:
                  "linear-gradient(177.42deg, rgba(255, 255, 255, 0.05) 2.32%, rgba(255, 255, 255, 0) 98.02%)",
              }}
            >
              {/* ✅ Use Next.js <Image> for optimization */}
              <Image
                src={feature.image}
                width={100}
                height={100}
                alt={feature.title}
                className="object-contain"
              />

              <div className="text-left text-white">
                <h4 className="mt-4 text-xl font-semibold">{feature.title}</h4>
                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Featured;
