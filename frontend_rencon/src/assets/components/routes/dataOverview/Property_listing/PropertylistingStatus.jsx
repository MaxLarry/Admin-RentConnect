import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

export const description = "A stacked area chart with gradient fill";

const chartData = [
  { month: "January", approved: 120, request: 50, rejected: 16 },
  { month: "February", approved: 200, request: 100, rejected: 5 },
  { month: "March", approved: 150, request: 80, rejected: 7 },
  { month: "April", approved: 30, request: 40, rejected: 3 },
  { month: "May", approved: 180, request: 90, rejected: 20 },
  { month: "June", approved: 200, request: 110, rejected: 15 },
];

const chartConfig = {
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-1))",
  },
  request: {
    label: "Request",
    color: "hsl(var(--chart-2))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-3))",
  },
};

function PropertylistingStatus() {
  return (
    <Card className="rounded-md shadow-md block items-center col-start-4 md:col-end-3 lg:col-end-10 noselect">
      <CardHeader>
        <CardTitle>Property Listing Status</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-approved)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-approved)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRequest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-request)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-request)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-rejected)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-rejected)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="rejected"
              fill="url(#fillRejected)"
              fillOpacity={0.4}
              stroke="var(--color-rejected)"
              stackId="a"
              dot={{
                fill: "var(--color-rejected)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Area
              dataKey="request"
              fill="url(#fillRequest)"
              fillOpacity={0.4}
              stroke="var(--color-request)"
              stackId="a"
              dot={{
                fill: "var(--color-request)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Area
              dataKey="approved"
              fill="url(#fillApproved)"
              fillOpacity={0.4}
              stroke="var(--color-approved)"
              stackId="a"
              dot={{
                fill: "var(--color-approved)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
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

export default PropertylistingStatus;
