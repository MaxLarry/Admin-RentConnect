"use client";

import React, { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, X as ClearIcon } from "lucide-react"; // Import X icon
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerWithRange({ className, onDateChange }) {
  const [date, setDate] = useState(null);

  // Handle date changes and pass them to the parent component
  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateChange && onDateChange(newDate); // Call parent prop function if exists
  };

  // Clear the selected date
  const handleClearDate = () => {
    setDate(null);
    onDateChange && onDateChange(null); // Reset date in the parent component
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal relative", // Add relative positioning
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
            {date && (
              <ClearIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-red-600"
                onClick={handleClearDate} // Trigger clear function on click
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
