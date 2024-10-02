import * as React from "react";
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import axios from "axios";
import DropdownFilter from "../DropdownFilter";
import {
  CartesianGrid,
  Line,
  Area,
  AreaChart,
  LineChart,
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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  register: {
    label: "Register",
    color: "hsl(var(--chart-1))",
  },
};

function NewlyRegistered() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedValue, setSelectedValue] = useState("30d");
  const [todaysRegisterCount, setTodaysRegisterCount] = useState(0);

  const opt = [
    { value: "24h", label: "24h" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "1y", label: "1y" },
    { value: "all", label: "All time" },
  ];

  useEffect(() => {
    const fetchNewRegister = async () => {
      setLoading(true);

      try {
        // Fetching data from your backend with the selected timeframe
        const response = await axios.get(`/data/user-register-count`, {
          params: { timeframe: selectedValue },
        });

        if (response.data && response.data.length > 0) {
          // Map response data to the chart structure
          const formattedData = response.data.map((item) => ({
            time: item.days || item.hours || item.date || item.month,
            userCount: item.count,
            fullDate: item.date, // Keeping the full date for tooltip
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

    const fetchTodaysRegisterCount = async () => {
      try {
        const response = await axios.get(`/data/user-register-count`, {
          params: { timeframe: "24h" },
        });

        const todayCount = response.data.reduce((acc, curr) => acc + curr.count, 0);
        setTodaysRegisterCount(todayCount);
      } catch (error) {
        console.error("Error fetching today's registered users:", error);
        setTodaysRegisterCount(0);
      }
    };

    fetchNewRegister();
    fetchTodaysRegisterCount();
  }, [selectedValue]); // Re-fetch when selected timeframe changes

  
  const totalUser = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.userCount, 0);
  }, [chartData]);

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
          <CardTitle>Newly Registered Users</CardTitle>
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 30,
              right: 30,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={10}
              // Show only month and day for 30d timeframe
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
            <Tooltip
              cursor={{ stroke: 'gray', strokeWidth: 1, strokeDasharray: '5 5' }} 
              content={<ChartTooltipContent indicator="line" />}
              labelFormatter={(time) => {
                // For 30d, display full date in tooltip
                if (selectedValue === "30d") {
                  return new Date(time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                }
                return time;
              }}
            />
            <Line
              dataKey="userCount"
              type="monotone"
              strokeWidth={2}
              stroke= "var(--color-register)"
              fillOpacity={0.4}
              dot= {false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Today's registered users: {todaysRegisterCount}
        </div>
      </CardFooter>
    </Card>
  );
}

export default NewlyRegistered;
