import * as React from "react";
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import axios from "axios";
import { Area, AreaChart, CartesianGrid,Tooltip, XAxis } from "recharts";
import DropdownFilter from "../DropdownFilter";
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



function PropertylistingStatus() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedValue, setSelectedValue] = useState("30d");

  const opt = [
    { value: "24h", label: "24h" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "1y", label: "1y" },
    { value: "all", label: "All time" },
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
  useEffect(() => {
    const fetchNewRegister = async () => {
      setLoading(true);

      try {
        // Fetching data from your backend with the selected timeframe
        const response = await axios.get(`/data/property-listing-status`, {
          params: { timeframe: selectedValue },
        });

        if (response.data && response.data.length > 0) {
          const formattedData = response.data.map((item) => ({
            time: item.days || item.hours || item.date || item.month,
            approved: item.data.approved_count,
            request: item.data.request_count,
            rejected: item.data.rejected_count,
            fullDate: item.date, // Optional for tooltip display
          }));

          setChartData(formattedData);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("Error fetching newly registered users:", error);
        setError("Failed to fetch Newly Register data");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewRegister();
  }, [selectedValue]); 


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  return (
    <Card className="rounded-md shadow-md block items-center col-start-4 md:col-end-3 lg:col-end-10 noselect">
      <CardHeader className="flex flex-row justify-between pb-6">
        <div>
        <CardTitle>Property Listing Status</CardTitle>
        <CardDescription className="mt-2">
            Showing user registrations over {selectedValue}
          </CardDescription>
        </div>
        <div>
          <DropdownFilter
            options={opt}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={10}
                            tickFormatter={(time) => {
                if (selectedValue === "90d") {
                  const [startDate, endDate] = time.split(" - ");
                  return new Date(startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } else if (selectedValue === "30d") {
                  return new Date(time).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } else if (selectedValue === "24h") {
                  // Format for 24h
                  const [startTime] = time.split(" - ");
                  return startTime;
                }
                return time;
              }}
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
