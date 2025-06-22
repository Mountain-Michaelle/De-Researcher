import React from "react";

const Pages = () => {
  return (
    <div className="bg-gradient-to-b from-[#0e1d32] to-[#081529] text-white font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">Bloc-Search</div>
        <nav className="flex space-x-6">
          <a href="#how-it-works" className="hover:text-purple-400">How it works</a>
          <a href="#projects" className="hover:text-purple-400">Projects</a>
          <button className="bg-purple-500 px-4 py-2 rounded-lg">Connect Wallet</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold">
          Empower Research, Reward Innovation
        </h1>
        <p className="text-lg mt-4">
          Submit your project topics, incentivize research, and unlock progress with the
          power of blockchain.
        </p>
        <button className="mt-8 bg-purple-500 px-6 py-3 rounded-lg text-lg font-semibold">
          Get Started
        </button>
        <div className="mt-12">
          <img
            src="/path-to-placeholder-image.svg"
            alt="Hero SVG"
            className="mx-auto w-2/3 md:w-1/2"
          />
        </div>
      </section>

      {/* Supported Tokens */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-semibold">Supported Networks/Tokens</h2>
        <div className="flex justify-center flex-wrap gap-4 mt-8">
          {Array(12).fill("/path-to-token-icon.svg").map((icon, index) => (
            <img
              key={index}
              src={icon}
              alt={`Token ${index + 1}`}
              className="h-12 w-12"
            />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 bg-[#0b1a2b]">
        <h2 className="text-3xl font-semibold text-center">How it works</h2>
        <div className="flex flex-col md:flex-row justify-center mt-12 space-y-8 md:space-y-0 md:space-x-8">
          {[
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
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#112240] p-6 rounded-lg text-center w-80">
              <h3 className="text-lg font-bold text-purple-400">{item.step}</h3>
              <h4 className="mt-4 text-xl font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center">Features</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {[
            {
              title: "Decentralized Research",
              description: "Global collaboration without centralized control.",
            },
            {
              title: "Incentivized Participation",
              description:
                "Researchers earn tokens based on their contributions and impact.",
            },
            {
              title: "Community Verification",
              description:
                "Ensures the credibility of each research contribution.",
            },
            {
              title: "No Barriers",
              description:
                "Skip registration—just connect your wallet to participate.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-[#112240] p-6 rounded-lg text-center w-80">
              <h4 className="mt-4 text-xl font-semibold">{feature.title}</h4>
              <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Projects */}
      <section id="projects" className="py-16 bg-[#0b1a2b]">
        <h2 className="text-3xl font-semibold text-center">Latest Research Projects</h2>
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {Array(4).fill(0).map((_, index) => (
            <div
              key={index}
              className="bg-[#112240] p-6 rounded-lg text-center w-80">
              <h4 className="text-xl font-semibold">Blockchain-based Voting System</h4>
              <p className="mt-2 text-sm text-gray-400">By: Jonny Gabriela</p>
              <p className="mt-1 text-sm text-gray-400">July, 2024</p>
              <div className="mt-4 text-gray-400 text-sm">Total Tokens Committed</div>
              <p className="font-bold text-xl">200,000 RWA</p>
              <div className="mt-2">Milestone</div>
              <div className="relative w-full h-2 bg-gray-700 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-purple-500"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center bg-[#0e1d32]">
        <p className="text-gray-400">© Bloc-Search 2024</p>
      </footer>
    </div>
  );
};

export default Pages;
