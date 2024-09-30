import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";

function DropdownFilter({ options, selectedValue, setSelectedValue }) {
  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm py-2 px-4 flex justify-between items-center">
          {options.find((opt) => opt.value === selectedValue)?.label}
          <IoIosArrowDown className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-2">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            className="text-sm dark:text-gray-200 hover:bg-zinc-800"
            onClick={() => handleOptionClick(opt.value)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownFilter;
