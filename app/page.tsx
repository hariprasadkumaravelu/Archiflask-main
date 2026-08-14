import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";

export const metadata: Metadata = {
  title: "ArchiFlask | Architecture Project Management Software India",
  description: "Run your design or construction firm on a system. ArchiFlask brings projects, drawings, teams, site activity & profitability into one platform. Book a demo.",
  alternates: { canonical: "/" },
  openGraph: { url: "https://www.archiflask.com/" },
};
import { About } from "@/components/sections/home/About";
import { Statement } from "@/components/sections/home/Statement";
import { Problem } from "@/components/sections/home/Problem";
import { Questions } from "@/components/sections/home/Questions";
import { Features } from "@/components/sections/home/Features";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { ForClients } from "@/components/sections/home/ForClients";
import { Pricing } from "@/components/sections/home/Pricing";
import { AddOns } from "@/components/sections/home/AddOns";
import { FinalCta } from "@/components/sections/home/FinalCta";
import AuthBridgeRedirect from "@/components/LandingAuthBridge";
import { Suspense } from "react";

export default function HomePage() {
  console.log('vasanth')
  return (
    <main className="relative z-[2]">
       <Suspense fallback={null}>
        <AuthBridgeRedirect mode="root" />
      </Suspense>
      <Hero />
      <About />
      <Statement />
      <Problem />
      <Questions />
      <Features />
      <Capabilities />
      <ForClients />
      <Pricing />
      <AddOns />
      <FinalCta />
    </main>
  );
}