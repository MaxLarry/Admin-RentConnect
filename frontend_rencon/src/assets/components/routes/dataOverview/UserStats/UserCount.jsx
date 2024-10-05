import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
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

function UserCount() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/data/user-count");

        if (response.data && response.data.length > 0) {
          const { LandlordCount, OccupantCount, UnverifiedCount } = response.data[0];

          // Map the response to the expected chartData format
          setChartData([
            { category: "Landlords", user: LandlordCount, fill: "var(--color-landlord)" },
            { category: "Occupants", user: OccupantCount, fill: "var(--color-occupant)" },
            { category: "Unverified Users", user: UnverifiedCount, fill: "var(--color-unverified)" },
          ]);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the User Count!", error);
        setError("Failed to fetch User Count");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  const totalUser = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.user, 0);
  }, [chartData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const chartConfig = {
    user: {
      label: "User",
    },
    landlord: {
      label: "Landlords",
      color: "hsl(var(--chart-1))",
    },
    occupant: {
      label: "Occupants",
      color: "hsl(var(--chart-2))",
    },
    unverified: {
      label: "Unverified Users",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card className="rounded-md shadow-md block items-center col-start-1 md:col-end-3 lg:col-end-4 noselect">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Number of User</CardTitle>
        <CardDescription>Current Total of Registered User</CardDescription>
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
          Showing the total of user who Registered
        </div>
      </CardFooter>
    </Card>
  );
}

export default UserCount;
