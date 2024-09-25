import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts"; 
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardFooter } from "@/components/ui/card"; 
import DropdownFilter from "./DropdownFilter"; 

function GraphV() {
  const [selectedValue, setSelectedValue] = useState("30d");

  const chartConfig = {
    Request: {
      label: "Request",
      color: "hsl(var(--chart-1))",
    },
  }

  const chartData = [
    { month: "January", Request: 186, },
    { month: "February", Request: 305, },
    { month: "March", Request: 237, },
    { month: "April", Request: 73, },
    { month: "May", Request: 209, },
    { month: "June", Request: 214, },
  ];

  const opt = [
    { value: "24h", label: "24h" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "1y", label: "1y" },
    { value: "all", label: "All time" },
  ];


  return (
    <Card className="p-7 rounded-md shadow-md block items-center lg:col-start-4 lg:col-end-7 lg:row-start-1 lg:row-end-3 md:col-start-1 md:col-end-3 relative">
      <CardContent className="p-0">
        <div className="flex justify-between pb-6">
          <div>
            <div className="text-lg font-bold">1230</div>
            <span className="text-md font-normal">Listing Requests</span>
          </div>
          <DropdownFilter options={opt} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
        </div>
        <ChartContainer config={chartConfig} className='pb-6'>
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
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Request)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Request)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="Request"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-Request)"
              stackId="a"
              dot={{
                fill: "var(--color-Request)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='p-0'>
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

export default GraphV;
