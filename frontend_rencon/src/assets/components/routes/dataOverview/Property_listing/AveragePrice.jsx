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
    const fetchAveragePrices = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/data/property-average-price");

        if (response.data && response.data.length > 0) {
          // Assuming backend returns an array of propertyType, averagePrice, and totalProperties
          const mappedData = response.data.map(item => ({
            category: item.propertyType, 
            averagePrice: item.averagePrice, 
            fill: item.propertyType === "Boarding House" ? "var(--color-boardingHouse)" : "var(--color-apartment)"
          }));

          setChartData(mappedData);
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

    fetchAveragePrices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const chartConfig = {
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
        <CardTitle className="text-xl font-bold">Average Price</CardTitle>
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
              dataKey="averagePrice" // Use averagePrice from backend
              nameKey="category"
              innerRadius={30}
              outerRadius={100}
              fill="#8884d8"
              stroke="none"
              strokeWidth={1}
            >
              <LabelList
                dataKey="averagePrice" // Display the category name inside the chart
                position="inside"
                fill="#fff"
                fontSize={12}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Average Prices up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-center text-muted-foreground">
          Showing average prices for Boarding Houses and Apartments
        </div>
      </CardFooter>
    </Card>
  );
}

export default AveragePrice;
