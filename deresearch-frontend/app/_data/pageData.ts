// src/app/[your-folder]/pageData.ts

export interface Feature {
  title: string;
  description: string;
  image: string;
}

export const pageData1: Feature[] = [
  {
    title: "Decentralized Research",
    description: "Global collaboration without centralized control.",
    image: "/images/features/decentralized.svg", // ✅ add leading slash for Next.js public path
  },
  {
    title: "Incentivized Participation",
    description: "Researchers earn tokens based on their contributions and impact.",
    image: "/images/features/incentralized.svg",
  },
  {
    title: "Community Verification",
    description: "Ensures the credibility of each research contribution.",
    image: "/images/features/community.svg",
  },
  {
    title: "No Barriers",
    description: "Skip registration—just connect your wallet to participate.",
    image: "/images/features/nobarrier.svg",
  },
];
