import * as React from "react";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownMenuCheckboxes({ selectedRoles, onRoleChange }) {
  const admin_list = [
    "Super-Admin", "Admin", "Listing Manager", "User Manager"
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-xs space-x-2" variant="outline">
          <ListFilter className="w-5" />
          <span>Filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-xs">Admin Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {admin_list.map((admin) => (
          <DropdownMenuCheckboxItem
            className="text-xs"
            key={admin}
            checked={selectedRoles.includes(admin)}
            onCheckedChange={() => onRoleChange(admin)}
          >
            {admin}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
