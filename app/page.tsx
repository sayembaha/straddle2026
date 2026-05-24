"use client";

import dynamic from "next/dynamic";

const Straddle = dynamic(() => import("@/components/straddle"), { ssr: false });

export default function Home() {
  return <Straddle />;
}