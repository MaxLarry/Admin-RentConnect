import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { IoIosArrowDown } from "react-icons/io";
import { Card, CardContent } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Register the necessary components, including Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function PARdataGraph() {
  const [selectedValue, setSelectedValue] = useState("30d");

  // Sample data for the chart based on selected time range
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Pending",
        data: [30, 20, 10, 15, 12, 98],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Approved",
        data: [20, 25, 30, 35, 90, 45],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Rejected",
        data: [10, 15, 70, 10, 38, 5],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#e5e7eb",
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        cubicInterpolationMode: "monotone",
      },
      point: {
        radius: 0,
        hoverRadius: 5,
        hitRadius: 20,
      },
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  };

  // Available options for the dropdown
  const opt = [
    { value: "24h", label: "24h" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "1y", label: "1y" },
    { value: "all", label: "All time" },
  ];

  // Handle option click
  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };

  return (
    <Card className="px-10 py-5 rounded-md shadow-md h-full block items-center lg:col-start-4 lg:col-end-7 lg:row-start-4 lg:row-end-6 md:col-start-1 md:col-end-3 relative">
      <CardContent>
        <div className="flex justify-between mb-9">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            Property Listing Status Overview
          </span>

          {/* shadcn Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm text-gray-700 dark:text-gray-200 py-2 px-4 flex justify-between items-center"
              >
                {opt.find((opt) => opt.value === selectedValue)?.label}
                <IoIosArrowDown className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {opt.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  className="text-sm dark:text-gray-200 hover:bg-zinc-800"
                  onClick={() => handleOptionClick(opt.value)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chart container */}
        <div className="flex mt-4">
          <div className="h-full w-full">
            <Line className="w-fit" data={data} options={options} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PARdataGraph;
