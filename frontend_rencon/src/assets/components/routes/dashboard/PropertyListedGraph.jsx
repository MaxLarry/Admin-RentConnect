// PropertyListedGraph.js
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Card, CardContent } from "@/components/ui/card";
import DropdownFilter from "./Dropdownfilter";

// Register the scales and elements for the chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PropertyListedGraph() {
  const [selectedValue, setSelectedValue] = useState("30d");

  // Sample data for the chart based on selected time range
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Request",
        data: [30, 90, 40, 60, 70, 90],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Custom plugin for drawing the vertical line on hover
  const verticalLinePlugin = {
    id: "verticalLinePlugin",
    afterDraw: (chart) => {
      const { ctx, tooltip, chartArea } = chart;

      if (tooltip && tooltip.getActiveElements().length > 0) {
        const activePoint = tooltip.getActiveElements()[0];
        const x = activePoint.element.x;
        const topY = chartArea.top;
        const bottomY = chartArea.bottom;

        ctx.save();
        ctx.beginPath();

        ctx.setLineDash([9, 5]);
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(155, 155, 155, 0.8)";
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  ChartJS.register(verticalLinePlugin);

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
        hitRadius: 40,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      verticalLinePlugin: true,
    },
  };

  // Available time range options
  const opt = [
    { value: "24h", label: "24h" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "1y", label: "1y" },
    { value: "all", label: "All time" },
  ];

  return (
    <Card className="px-10 py-5 rounded-md shadow-md block items-center lg:col-start-4 lg:col-end-7  md:col-start-1 md:col-end-3 relative">
      <CardContent className="p-0">
        <div className="flex justify-between">
          <div>
            <div className="text-lg font-bold text-zinc-900 dark:text-white">1230</div>
            <span className="text-md font-normal text-gray-500 dark:text-gray-200">Listed Properties</span>
          </div>
          <DropdownFilter options={opt} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
        </div>
        <div className="flex mt-4">
          <div className="h-auto w-full">
            <Line className="w-fit" data={data} options={options} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyListedGraph;
