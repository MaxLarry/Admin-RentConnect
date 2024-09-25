"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", removed: 186, listed: 80 },
  { month: "February", removed: 305, listed: 200 },
  { month: "March", removed: 237, listed: 120 },
  { month: "April", removed: 73, listed: 190 },
  { month: "May", removed: 209, listed: 130 },
  { month: "June", removed: 214, listed: 140 },
];

const chartConfig = {
  removed: {
    label: "Removed",
    color: "hsl(var(--chart-1))",
  },
  listed: {
    label: "Listed",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

function ListedPropertyRemove() {
  return (
    <Card className="rounded-md shadow-md block items-center col-start-1 md:col-end-4 lg:col-end-7 noselect">
      <CardHeader>
        <h2 className="card-title">Bar Chart - Stacked Removed vs Listed</h2>
        <p className="card-description">January - June 2024</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}
        className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 29,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="removed" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="removed"
              stackId="a"
              layout="vertical"
              fill="var(--color-removed)"
              radius={[4, 0, 0, 4]}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="listed"
              stackId="a"
              layout="vertical"
              fill="var(--color-listed)"
              radius={[0, 4, 4, 0]}
            >
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className=" flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total removed and listed properties for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default ListedPropertyRemove;
