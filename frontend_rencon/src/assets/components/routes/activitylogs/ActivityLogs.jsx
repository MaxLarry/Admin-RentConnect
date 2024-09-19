import React, { useState } from "react";
import CopyableText from "../../ui/CopyableText";
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/input"
import { parse, isAfter, isBefore } from 'date-fns';
import {DatePickerWithRange} from "@/components/ui/DatePickerWithRange"
 
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

function ActivityLogs() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedAction, setSelectedAction] = useState("All Actions");
  const [dateRange, setDateRange] = useState(null);

  const logs = [
    {
      id: "09876w543210987654d321",
      adminName: "John Doe",
      action: "Added a listing",
      timestamp: "2024-09-12 10:23:45",
      ipAddress: "192.168.0.1",
      target: "Listings",
      role: "Super-Admin",
    },
    {
      id: "09876w54321s0987654321",
      adminName: "Jane Smith",
      action: "Updated user info",
      timestamp: "2024-09-12 11:05:22",
      ipAddress: "192.168.0.2",
      target: "User Management",
      role: "Admin",
    },
    // More log entries
  ];

  const req_column = [
    "Log ID",
    "Admin Name",
    "Role",
    "Action",
    "Timestamp",
    "IP Address",
    "Entity Affected",
    "Changes Made",
  ];

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle role change from dropdown
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  // Handle action change from dropdown
  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  // Filter logs based on search, role, action, and date range
  const filteredLogs = logs.filter((log) => {
    const isMatchSearchQuery =
      log.adminName.toLowerCase().includes(searchQuery) ||
      log.action.toLowerCase().includes(searchQuery) ||
      log.id.toLowerCase().includes(searchQuery);
  
    const isMatchRole = selectedRole === "All Roles" || log.role === selectedRole;
    const isMatchAction = selectedAction === "All Actions" || log.action === selectedAction;
  
    // Parse log timestamp to Date object using `date-fns`
    const logDate = parse(log.timestamp, "yyyy-MM-dd HH:mm:ss", new Date());
  
    // Date range filtering using `isAfter` and `isBefore` from `date-fns`
    const isMatchDateRange =
      !dateRange || 
      (!dateRange.from || isAfter(logDate, dateRange.from) || logDate === dateRange.from) && // Compare logDate with `from`
      (!dateRange.to || isBefore(logDate, dateRange.to) || logDate === dateRange.to); // Compare logDate with `to`
  
    return isMatchSearchQuery && isMatchRole && isMatchAction && isMatchDateRange;
  });

  // Pagination logic
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <div className="px-4 pt-14 sm:ml-60 min-h-screen block gap-2 flex-col lg:flex-row translate-all duration-300">
      <div className="flex justify-between items-center p-5">
        <h1 className="font-bold text-2xl p-4">
          Activity Logs
        </h1>
      </div>

      {/* Search, Role Filter, Action Filter, and Date Picker */}
      <div className="flex flex-wrap gap-4 px-9 pb-5">
        <div className="relative">
          <SearchInput
            type="text"
            placeholder="Search logs..."
            className="rounded-md border focus:ring-teal-400 w-auto"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="text-xs">
              {selectedRole || "All Roles"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleRoleSelect("All Roles")}>
              All Roles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleSelect("Super-Admin")}>
              Super-Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleSelect("Admin")}>
              Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className=" text-xs">
              {selectedAction || "All Actions"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleActionSelect("All Actions")}>
              All Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionSelect("Added a listing")}>
              Added a listing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionSelect("Updated user info")}>
              Updated user info
            </DropdownMenuItem>
            {/* Add other actions as needed */}
          </DropdownMenuContent>
        </DropdownMenu>
        <DatePickerWithRange onDateChange={setDateRange} />
      </div>

      <div className="overflow-auto rounded-md px-9">
        <Table>
          <TableHeader>
            <TableRow>
              {req_column.map((column) => (
                <TableHead key={column}
                className=" text-zinc-900 dark:text-gray-200 font-bold">{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <CopyableText text={log.id} />
                </TableCell>
                <TableCell>{log.adminName}</TableCell>
                <TableCell>{log.role}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>{log.target}</TableCell>
                <TableCell>{log.target}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredLogs.length > 0 && totalPages >= 1 && (
          <Pagination className="mt-4 cursor-pointer">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default ActivityLogs;
