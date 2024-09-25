import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

export const description = "A donut chart with text";

const chartData = [
  { category: "Boarding House", count: 150, fill: "var(--color-landlord)" },
  { category: "Apartment", count: 300, fill: "var(--color-occupant)" },
];

const chartConfig = {
  count: {
    label: "count",
  },
  landlord: {
    label: "Boarding House",
    color: "hsl(var(--chart-1))",
  },
  occupant: {
    label: "Apartment",
    color: "hsl(var(--chart-2))",
  },
  unverified: {
    label: "Unverified Users",
    color: "hsl(var(--chart-3))",
  },
};

function PropertyListedCount() {
  const totalUser = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className="rounded-md shadow-md block items-center col-start-1 md:col-end-3 lg:col-end-4 noselect">
      <CardHeader className="items-center pb-0">
        <CardTitle>Listed Property</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
             data={chartData}
             dataKey="count"
             label
             nameKey="category"
             innerRadius={50}
             outerRadius={85}
             stroke="none" // Set stroke to none to remove line between slices
             strokeWidth={1} // Adjusted stroke width
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUser.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          All users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total users for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default PropertyListedCount;
