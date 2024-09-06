//Dashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../../ui/Header";
import Sidebar from "../../ui/Sidebar";
import Table_list from "../listmanagement/Pending";
import TabsButton from "../listmanagement/TabsButton";

function Dashboard() {
  return (
    <>
      <div
        className="p-4 sm:ml-64 h-full block gap-2 flex-col lg:flex-row translate-all
    duration-300 mt-14"
      >
        <h1 className="font-bold text-2xl p-4"></h1>
        <TabsButton />
        <Table_list />
      </div>
    </>
  );
}

export default Dashboard;
