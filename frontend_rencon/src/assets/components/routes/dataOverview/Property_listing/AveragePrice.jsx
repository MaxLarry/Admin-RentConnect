import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, LabelList } from "recharts";

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

// Updated chart data to reflect Boarding House and Apartment
const chartData = [
  { category: "Boarding House", user: 150, fill: "var(--color-boardingHouse)" },
  { category: "Apartment", user: 300, fill: "var(--color-apartment)" },
];

const chartConfig = {
  user: {
    label: "User",
  },
  boardingHouse: {
    label: "Boarding House",
    color: "hsl(var(--chart-1))",
  },
  apartment: {
    label: "Apartment",
    color: "hsl(var(--chart-3))",
  },
};

function AveragePrice() {
  const totalUser = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.user, 0);
  }, []);

  return (
    <Card className="rounded-md shadow-md block items-center col-start-7 md:col-end-3 lg:col-end-10 noselect">
      <CardHeader className="items-center pb-0">
        <CardTitle>Average Price</CardTitle>
        <CardDescription>Boarding House and Apartment</CardDescription>
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
              dataKey="user"
              innerRadius={40}
              nameKey="category"
              stroke="none"
              strokeWidth={1}
            >
              <LabelList
                dataKey="user" // Use the 'user' value for labels
                position="inside" // Position of the labels inside the pie slices
                fill="#fff" // Set label color to white for contrast
                fontSize={12} // Set font size
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

export default AveragePrice;
