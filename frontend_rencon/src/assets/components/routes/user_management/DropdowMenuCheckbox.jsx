"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState(true)
  const [showActivityBar, setShowActivityBar] = React.useState(false)
  const [showPanel, setShowPanel] = React.useState(false)

  const [checkedAdmins, setCheckedAdmins] = React.useState({})

  const admin_list = [
    "Super-Admin", "Admin", "Listing Manager", "User Manager"
  ]

  // Function to handle checkbox state change for admin list items
  const handleAdminChange = (admin) => {
    setCheckedAdmins((prevState) => ({
      ...prevState,
      [admin]: !prevState[admin],
    }));
  }

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
            checked={!!checkedAdmins[admin]}
            onCheckedChange={() => handleAdminChange(admin)}
          >
            {admin}
          </DropdownMenuCheckboxItem>
        ))}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
