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
} from "chart.js";

// Register the scale
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PropertyListedGraph() {
  const dropdownRef = useRef(null); // Ref for dropdown container
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("30d"); // Default selected option

  // Sample data for the chart based on selected time range
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"], // Modify labels based on timeRange if necessary
    datasets: [
      {
        label: "Listed Properties",
        data: [30, 50, 40, 60, 70, 90], // Adjust data points for the chart
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
        radius: 0,
        hoverRadius: 5,
        hitRadius: 40,
      },
    },
    plugins: {
      legend: {
        display: false,
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
    <div className="bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 px-10 py-5 rounded-md shadow-md block items-center lg:col-start-4 lg:col-end-7  md:col-start-1 md:col-end-3 relative">
      {/* Ensure relative positioning on the parent container */}
      <div className="flex justify-between">
        <div>
          <div className="text-lg font-bold text-zinc-900 dark:text-white">1230</div>
          <span className="text-md font-normal text-gray-500 dark:text-gray-200">
            Listed Properties
          </span>
        </div>

        {/* Dropdown button and menu */}
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            className=" text-sm text-gray-700 dark:text-gray-200 py-2 px-4 cursor-pointer flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)} 
          >
            {opt.find(opt => opt.value === selectedValue)?.label}
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
        <div className="h-auto w-full">
          <Line className="w-fit" data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default PropertyListedGraph;
