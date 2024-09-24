import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserStats from "./UserStats";
import Component from "./Trial";
 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

function DataOverview() {

  return (
    <ScrollArea className="px-4 pt-14 sm:ml-60 min-h-screen block gap-2 flex-col lg:flex-row translate-all duration-300">
      <div className="flex justify-between items-center p-5">
        <h1 className="font-bold text-2xl p-4">
          Data Overview
        </h1>
      </div>
      <div className="grid p-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-9 grid-rows-subgrid max-w-full mx-auto">
        <UserStats/>
      </div>
    </ScrollArea>
  );
}

export default DataOverview;
