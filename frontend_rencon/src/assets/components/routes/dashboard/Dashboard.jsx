//Dashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../../ui/Header";
import Sidebar from "../../ui/Sidebar";
import ActiveUsercard from "./ActiveUser";
import { FiUsers } from "react-icons/fi";
import GraphV from "./GraphV";
import PropertyListedGraph from "./PropertyListedGraph";
import PendingRequestdash from "./PendingRequestdash";
import PARdataGraph from "./PARdataGraph";
import ActivityLogs from "./ActivityLogsDash";
import MostVisited from "./MostVisited";
import useLocomotiveScroll from "../../ui/useLocomotiveScroll";
import { ScrollArea } from "@/components/ui/scroll-area";

function Dashboard() {
  const scrollRef = useLocomotiveScroll(); // Use the custom hook
  return (
    <>
      <ScrollArea
        className=" px-4 pt-14 sm:ml-60 h-full block gap-2 flex-col lg:flex-row translate-all
    duration-300  text-zinc-900 tracking-tighter"
      >
        <h1 className="font-bold text-2xl p-4 text-zinc-900 dark:text-gray-200">
          Dashboard
        </h1>
        <div className="grid p-4 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 max-w-full w-full mx-auto">
          <ActiveUsercard />
          <PropertyListedGraph />
          <PendingRequestdash />
          <GraphV />
          <MostVisited />
          <PARdataGraph />
          <ActivityLogs />
        </div>
      </ScrollArea>
    </>
  );
}

export default Dashboard;
