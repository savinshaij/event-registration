"use client";
import { useState } from "react";
import { Home } from "@/components/booking/Home"; // <-- Uppercase import
import { FiDollarSign, FiHome, FiMonitor, FiShoppingCart } from "react-icons/fi";

const Page = () => { // <-- Uppercase component name
  return (
    <div className="flex bg-indigo-50">
      <Home /> {/* <-- Uppercase usage */}
    </div>
  );
};

export default Page; // <-- Export as default