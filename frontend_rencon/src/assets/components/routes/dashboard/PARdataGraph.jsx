import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { IoIosArrowDown } from "react-icons/io";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Import Filler for area charts
} from "chart.js";

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
  const dropdownRef = useRef(null); // Ref for dropdown container
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("30d"); // Default selected option

  // Sample data for the chart based on selected time range
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"], // Modify labels based on timeRange if necessary
    datasets: [
      {
        label: "Pending",
        data: [30, 20, 10, 15, 12, 98], // Example data for Pending
        borderColor: "rgba(54, 162, 235, 1)", // Blue
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Semi-transparent blue for area
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Approved",
        data: [20, 25, 30, 35, 90, 45], // Example data for Approved
        borderColor: "rgba(75, 192, 192, 1)", // Green
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Semi-transparent green for area
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Rejected",
        data: [10, 15, 70, 10, 38, 5], // Example data for Rejected
        borderColor: "rgba(255, 99, 132, 1)", // Red
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Semi-transparent red for area
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
            display: false, // Remove the y-axis border line
          },
      },
    },
    elements: {
      line: {
        cubicInterpolationMode: "monotone",
      },
      point: {
        radius: 0, // No point by default
        hoverRadius: 5,
        hitRadius: 20, // Point size on hover
      },
    },
    plugins: {
        legend: {
          labels: {
            usePointStyle: true, // Use circular point style for the legend
            pointStyle: "circle", // Set the point style to circle
          },
        },
      },
  };

  // Available options
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
    setIsOpen(false); // Close dropdown after selecting
  };

  // Detect clicks outside the dropdown and close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener to detect clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="bg-white border border-gray-200  dark:bg-zinc-800 dark:border-zinc-700 px-10 py-5 rounded-md shadow-md h-full block items-center lg:col-start-4 lg:col-end-7 lg:row-start-4 lg:row-end-6 md:col-start-1 md:col-end-3 relative">
      {/* Ensure relative positioning on the parent container */}
      <div className="flex justify-between mb-9">
        <span className="text-lg font-bold text-zinc-900 dark:text-white">
          Property Listing Status Overview
        </span>

        {/* Dropdown button and menu */}
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            className=" text-sm text-gray-700 dark:text-gray-200 py-2 px-4 cursor-pointer flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {opt.find((opt) => opt.value === selectedValue)?.label}
            <IoIosArrowDown className="ml-1" />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute mt-2 p-2 w-40 bg-white border border-gray-200 dark:border-zinc-700 dark:bg-zinc-900 shadow-lg rounded-lg z-10 right-0">
              {opt.map((opt) => (
                <div
                  key={opt.value}
                  className="py-2 px-4 text-sm dark:text-gray-200 rounded-md hover:bg-zinc-800 cursor-pointer"
                  onClick={() => handleOptionClick(opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart container */}
      <div className="flex mt-4">
        <div className="h-full w-full">
          <Line className="w-fit" data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default PARdataGraph;
