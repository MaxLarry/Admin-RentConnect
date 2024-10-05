import * as React from "react";
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import axios from "axios";
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


function AveragePrice() {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/data/property-average-price");

        if (response.data && response.data.length > 0) {
          const { boardingHouseAverageprice, apartmentAverageprice} = response.data[0];

          // Map the response to the expected chartData format
          setChartData([
            { category: "Boarding House", averagePrice: boardingHouseAverageprice, fill: "var(--color-boardingHouse)" },
            { category: "Apartment", averagePrice: apartmentAverageprice, fill: "var(--color-apartment)" },
          ]);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the Average!", error);
        setError("Failed to fetch Average");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

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
  boardingHouse: {
    label: "Boarding House",
    color: "hsl(var(--chart-1))",
  },
  apartment: {
    label: "Apartment",
    color: "hsl(var(--chart-3))",
  },
};

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
