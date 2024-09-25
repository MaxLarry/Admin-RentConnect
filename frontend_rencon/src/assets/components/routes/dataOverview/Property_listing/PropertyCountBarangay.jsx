import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Bar,
  BarChart,
  XAxis,
  Tooltip,
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
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

export const description = "A stacked bar chart with labels";

const chartData = [
  { baranggay: "Maningning", apartment: 186, boardinghouse: 80 },
  { baranggay: "Manggahan", apartment: 305, boardinghouse: 200 },
  { baranggay: "Bancao-Bancao", apartment: 237, boardinghouse: 120 },
  { baranggay: "Tiniguiban", apartment: 73, boardinghouse: 190 },
  { baranggay: "San Jose", apartment: 209, boardinghouse: 130 },
  { baranggay: "Irawan", apartment: 214, boardinghouse: 140 },
];

const chartConfig = {
  apartment: {
    label: "Apartment",
    color: "hsl(var(--chart-1))",
  },
  boardinghouse: {
    label: "Boarding House",
    color: "hsl(var(--chart-2))",
  },
};

function PropertyCountBarangay() {
  return (
    <Card className="rounded-md shadow-md block items-center col-start-1 md:col-end-3 lg:col-end-10 noselect">
      <CardHeader>
        <CardTitle>Number of Listed Properties per Barangay</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
            stackOffset="sign"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="baranggay"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="apartment"
              stackId="a"
              fill="var(--color-apartment)"
              radius={[0, 0, 4, 4]}
            >
              <LabelList
                position="top"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="boardinghouse"
              stackId="a"
              fill="var(--color-boardinghouse)"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                position="top"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% in this barangay{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default PropertyCountBarangay;
