// PropertyListedGraph.js
import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DropdownFilter from "./DropdownFilter";

function PropertyListedGraph() {
  const [selectedValue, setSelectedValue] = useState("30d");

  const chartConfig = {
    "Boarding House": {
      label: "Boarding House",
      color: "hsl(var(--chart-1))",
    },
    Apartment: {
      label: "Apartment",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartData = [
    { month: "January", "Boarding House": 120, Apartment: 66 },
    { month: "February", "Boarding House": 190, Apartment: 115 },
    { month: "March", "Boarding House": 145, Apartment: 92 },
    { month: "April", "Boarding House": 60, Apartment: 13 },
    { month: "May", "Boarding House": 140, Apartment: 69 },
    { month: "June", "Boarding House": 170, Apartment: 44 },
  ];

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
        <div className="flex justify-between pb-6">
          <div>
            <div className="text-lg font-bold">1230</div>
            <span className="text-md font-normal">Listed Properties</span>
          </div>
          <DropdownFilter
            options={opt}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </div>
        <ChartContainer config={chartConfig} className="pb-6">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient
                id="fillBoardingHouse"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))" // Updated to use the correct color
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))" // Updated to use the correct color
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillApartment" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))" // Updated to use the correct color
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))" // Updated to use the correct color
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="Boarding House"
              type="natural"
              fill="url(#fillBoardingHouse)"
              stroke="hsl(var(--chart-1))" // Ensure stroke color matches the area
              stackId="a"
              dot={{ fill: "hsl(var(--chart-1))" }} // Set the dot color
            />
            <Area
              dataKey="Apartment"
              type="natural"
              fill="url(#fillApartment)"
              stroke="hsl(var(--chart-2))" // Ensure stroke color matches the area
              stackId="a"
              dot={{ fill: "hsl(var(--chart-2))" }} // Set the dot color
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="p-0">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PropertyListedGraph;
