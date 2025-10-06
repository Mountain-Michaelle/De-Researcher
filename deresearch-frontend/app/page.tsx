"use client"
import Image from "next/image";
import Hero from "@/app/_components/hero/hero";
import Featured from "@/app/_components/featured";
import LatestResearchProject from "@/app/_components/research/latestResearchProject";
import Footer from "@/app/_components/footer";
export default function Home() {
  return (
    <div>
      <Hero />
      <Featured />
      <LatestResearchProject />
      <Footer showFooter={true} />
    </div>
  );
}
