import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, Line, CartesianGrid, XAxis, Tooltip } from "recharts"; // Removed 'defs'
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DropdownFilter from "./DropdownFilter";

function PARdataGraph() {
  const [selectedValue, setSelectedValue] = useState("30d");

  const chartConfig = {
    approved: {
      label: "Approved Requests",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending Requests",
      color: "hsl(var(--chart-2))",
    },
    rejected: {
      label: "Rejected Requests",
      color: "hsl(var(--chart-3))",
    },
  };

  const chartData = [
    { month: "January", approved: 12, pending: 503, rejected: 20 },
    { month: "February", approved: 33, pending: 790, rejected: 30 },
    { month: "March", approved: 237, pending: 90, rejected: 50 },
    { month: "April", approved: 73, pending: 45, rejected: 10 },
    { month: "May", approved: 209, pending: 65, rejected: 25 },
    { month: "June", approved: 214, pending: 80, rejected: 40 },
  ];

  const opt = [
    { value: "24h", label: "24h" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "1y", label: "1y" },
    { value: "all", label: "All time" },
  ];

  return (
    <Card className="px-10 py-8 rounded-md shadow-md h-full block items-center lg:col-start-4 lg:col-end-7 lg:row-start-4 lg:row-end-6 md:col-start-1 md:col-end-3 relative">
      <CardContent className="p-0">
        <div className="flex justify-between pb-6">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            Property Listing Status Overview
          </span>
          <DropdownFilter options={opt} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
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
            <Tooltip cursor={false} content={<ChartTooltipContent /> } /> 

            <defs>
           
              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="approved"
              type="natural"
              fill="url(#fillApproved)"
              fillOpacity={0.4}
              stroke="var(--color-approved)"
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              fillOpacity={0.4}
              stroke="var(--color-pending)"
            />
            <Area
              dataKey="rejected"
              type="natural"
              fill="url(#fillRejected)"
              fillOpacity={0.4}
              stroke="var(--color-rejected)"
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

export default PARdataGraph;
