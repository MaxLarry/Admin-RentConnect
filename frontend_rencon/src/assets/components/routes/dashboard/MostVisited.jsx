import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function MostVisited() {
  return (
    <Card className=" px-10 py-5 rounded-md shadow-md h-full block items-center lg:col-start-1 lg:col-end-4 lg:row-start-5 lg:row-end-6 md:col-start-1 md:col-end-3 relative">
      <CardContent className='py-5 px-0'>
      <span className="text-lg font-bold text-zinc-900 dark:text-white">
        Most Visited Properties
      </span>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Property 1</h3>
          <p className="mt-2 text-gray-600">Description for property 1.</p>
        </div>
        {/* Card 2 */}
        <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Property 2</h3>
          <p className="mt-2 text-gray-600">Description for property 2.</p>
        </div>
        {/* Card 3 */}
        <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Property 3</h3>
          <p className="mt-2 text-gray-600">Description for property 3.</p>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}

export default MostVisited;
