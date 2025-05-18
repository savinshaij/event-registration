"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import HeroSlider from "@/components/mainEventSlider/MainEventSlider";


// pages/index.js
import dynamic from "next/dynamic";

// Dynamically load EventList to avoid router issues during SSR
const EventList = dynamic(() => import("@/components/events/Eventlist"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
      <Navbar />
      <HeroSlider />
    
      <EventList/>
    
    </div>
  );
}

// --- Hero Section and Navbar ---



const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 dark:border-zinc-700 px-4 py-4 dark:bg-zinc-800 bg-white">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl text-zinc-900  dark:text-white">Event Registration</h1>
      </div>
      <a
        href="/login"
        className="w-24 transform rounded-lg  bg-black dark:bg-white px-6 py-2 font-medium dark:text-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 text-center"
      >
        Login
      </a>
    </nav>
  );
};