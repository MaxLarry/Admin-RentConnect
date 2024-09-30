import React, { useState, useEffect } from "react";
import axios from "axios";
import CopyableText from "../../ui/CopyableText";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchInput } from "@/components/ui/input";
import { parse, isAfter, isBefore, format } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"; // Ensure Checkbox is imported

function ActivityLogs() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedAction, setSelectedAction] = useState("All Actions");
  const [dateRange, setDateRange] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  
  const { toast } = useToast();

  const logColumn = [
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

  // Handle select all logs
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLogs(currentLogs.map((log) => log._id));
    } else {
      setSelectedLogs([]);
    }
    setSelectAll(checked);
  };

  // Filter logs based on search, role, action, and date range
  const filteredLogs = activityLogs
    .filter((log) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const admin_name = log.admin_name ? log.admin_name.toLowerCase() : "";
      const logId = log._id ? log._id.toLowerCase() : "";

      const isMatchSearchQuery =
        admin_name.includes(lowerCaseQuery) || logId.includes(lowerCaseQuery);

      const isMatchRole =
        selectedRole === "All Roles" || log.role === selectedRole;
      const isMatchAction =
        selectedAction === "All Actions" || log.action === selectedAction;

      // Parse timestamp directly as a Date object
      const logDate = log.timestamp ? new Date(log.timestamp) : null;

      // Check if logDate is within the selected date range
      const isMatchDateRange =
        !dateRange ||
        !logDate ||
        ((!dateRange.from || logDate >= dateRange.from) &&
          (!dateRange.to || logDate <= dateRange.to));

      return (
        isMatchSearchQuery && isMatchRole && isMatchAction && isMatchDateRange
      );
    })
    .sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  // Pagination logic
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  //handle deletion hehe
  const handleDeleteSelectedLogs = async () => {
    if (selectedLogs.length === 0) return;
  
    try {
      // Send a DELETE request with the selected property IDs
      const response = await axios.delete("/logs/admin-logs-deletion", {
        data: { ids: selectedLogs },
      });
  
      // Show success toast with message from backend
      toast({
        description: response.data.message, // message from backend
        variant: "success", // Use a success variant
      });
  
      // Update the state to remove the deleted requests
      setSelectedLogs((prevlogs) =>
        prevlogs.filter(
          (log) => !selectedLogs.includes(log._id)
        )
      );
      setSelectedLogs([]);
      setSelectAll(false);
      setDialogOpen(false); 
    } catch (error) {
      console.error("Error deleting selected logs:", error);
      toast({
        description: error.message || "Failed to delete selected logs.", // Use the extracted error message
        variant: "destructive",
      });
    }
  };
  
  // Fetch all activity logs
  useEffect(() => {
    const fetchActivityLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/logs/admin-activity-logs");
        setActivityLogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("There was an error fetching the Activity Logs!", error);
        setActivityLogs([]); // Fallback in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  useEffect(() => {
    if (selectedLogs.length !== currentLogs.length) {
      setSelectAll(false);
    } else if (
      selectedLogs.length === currentLogs.length &&
      currentLogs.length > 0
    ) {
      setSelectAll(true);
    }
  }, [selectedLogs, currentLogs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="px-4 pt-14 h-full sm:ml-60 block gap-2 flex-col lg:flex-row translate-all duration-300 overflow-y-auto">
      <div className="flex justify-between items-center p-5">
        <h1 className="font-bold text-2xl p-4">Activity Logs</h1>
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
            <Button className="text-xs">{selectedRole || "All Roles"}</Button>
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
            <Button className="text-xs">
              {selectedAction || "All Actions"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleActionSelect("All Actions")}>
              All Actions
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleActionSelect("Added a listing")}
            >
              Added a listing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleActionSelect("Updated user info")}
            >
              Updated user info
            </DropdownMenuItem>
            {/* Add other actions as needed */}
          </DropdownMenuContent>
        </DropdownMenu>

        <DatePickerWithRange onDateChange={setDateRange} />
      </div>

      <div className="overflow-auto rounded-md px-9">
        <Table className="min-w-full dark:border-zinc-600">
          <TableHeader>
            <TableRow className="border-b dark:border-zinc-600">
              <TableHead>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {logColumn.map((column) => (
                <TableHead
                  key={column}
                  className="text-zinc-900 dark:text-gray-200 font-bold"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => (
                <TableRow key={log._id} className="cursor-pointer">
                  <TableCell>
                    <Checkbox
                      checked={selectedLogs.includes(log._id)}
                      onCheckedChange={() =>
                        setSelectedLogs((prev) =>
                          prev.includes(log._id)
                            ? prev.filter((id) => id !== log._id)
                            : [...prev, log._id]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <CopyableText
                      text={log._id}
                      onCopy={() => console.log("Copying ID")}
                    />
                  </TableCell>
                  <TableCell>{log.admin_name}</TableCell>
                  <TableCell>{log.role}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {log.timestamp
                      ? format(new Date(log.timestamp), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{log.ip_address}</TableCell>
                  <TableCell>{log.entity_affected}</TableCell>
                  <TableCell>{log.changes ? log.changes : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={logColumn.length + 1}
                  className="text-center"
                >
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredLogs.length > 0 && totalPages >= 1 && (
        <Pagination className="my-5 cursor-pointer">
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

      {selectedLogs.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="fixed bottom-5 max-w-fit border dark:bg-zinc-950 bg-white rounded-lg text-sm shadow-md p-4 flex justify-between gap-10 items-center transition-transform transform translate-y-0 animate-slide-up">
            <div className="flex gap-3">
              <div className="text-gray-200 bg-teal-400 px-2 rounded-md">
                {selectedLogs.length}
              </div>
              <p>Rejected Request(s) Selected</p>
            </div>
            <div>
              <Button
                variant="outline"
                className="mr-2 "
                onClick={() => setSelectedLogs([])}
              >
                Cancel
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setDialogOpen(true)}>
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the selected activity logs?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-500"
                      onClick={handleDeleteSelectedLogs} // Call the delete function
                    >
                      Confirm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </ScrollArea>
  );
}

export default ActivityLogs;
