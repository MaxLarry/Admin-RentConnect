//Dashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../../ui/Header";
import Sidebar from "../../ui/Sidebar";
import ActiveUsercard from "./ActiveUser";
import GraphV from "./GraphV";
import ActivityLogs from "./ActivityLogs";

function Dashboard() {
  return (
    <>
      <div
        className="p-4 sm:ml-64 h-full block gap-2 flex-col lg:flex-row translate-all
    duration-300 mt-14 text-zinc-900"
      >
        <h1 className="font-bold text-2xl p-4 text-gray-700 dark:text-gray-200">Dashboard</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 max-w-full w-full mx-auto"> 
        <ActiveUsercard />
        <GraphV />
        <ActivityLogs />
        </div>
       
        
      </div>
    </>
  );
}

export default Dashboard;
