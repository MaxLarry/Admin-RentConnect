import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CopyableText from "../../ui/CopyableText";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function PendingRequestdash() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const itemsPerPage = 9; // Adjust this number as needed

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true); // Start loading

      try {
        const response = await axios.get("/requests/pending-requests");

        if (response.data && response.data.length > 0) {
          setPendingRequests(response.data);
        } else {
          setPendingRequests([]); // No data available
        }
      } catch (error) {
        console.error(
          "There was an error fetching the pending requests!",
          error
        );
        setError("Failed to fetch pending requests");
        setPendingRequests([]); // Set to empty array in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPendingRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  // Filter requests based on search query for requesterName, id, and status
  const filteredRequests = pendingRequests.filter((request) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const requestId = request._id ? request._id.toLowerCase() : "";
    const fullName = request.profile?.fullName
      ? request.profile.fullName.toLowerCase()
      : "";
    const status = request.status ? request.status.toLowerCase() : "";
    const createdAt = request.created_at
      ? format(new Date(request.created_at), "yyyy-MM-dd HH:mm").toLowerCase()
      : "";

    return (
      requestId.includes(lowerCaseQuery) ||
      fullName.includes(lowerCaseQuery) ||
      status.includes(lowerCaseQuery) ||
      createdAt.includes(lowerCaseQuery)
    );
  })
  .sort((a, b) => {
    // Sort by created_at in descending order (new to old)
    return new Date(b.created_at) - new Date(a.created_at);
  });
  
  // Sorting logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (key === "date") {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(a[key]);
      const dateB = new Date(b[key]);
      if (dateA < dateB) {
        return direction === "asc" ? -1 : 1;
      }
      if (dateA > dateB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    } else {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRequests.slice(indexOfFirstItem, indexOfLastItem);
  //console.log(currentItems); // Log the sliced items for debugging
  
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Handle sorting change
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <Card className="p-2 shadow-md block items-center lg:col-start-1 lg:col-end-4 lg:row-start-2 lg:row-end-5 md:col-start-1 md:col-end-3 relative">
      <CardContent className="p-5">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-bold">Pending Listing Requests</span>
          <div className="relative w-auto h-10">
            <SearchInput
              type="text"
              placeholder="Search by Name, ID, or Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 pl-10 w-full rounded-md h-8 focus:outline-none focus:ring-teal-400 dark:text-white"
            />
          </div>
        </div>
        <div className="justify-center overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer font-bold">ID</TableHead>
                  <TableHead className="cursor-pointer font-bold">
                    Requester Name
                  </TableHead>
                  <TableHead
                    className="cursor-pointer font-bold"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortConfig.key === "date"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </TableHead>
                  <TableHead className="cursor-pointer font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((request) => (
                    <TableRow key={request._id}>
                    <TableCell className="px-6 py-2 ">
                      <CopyableText
                        text={request._id}
                        onCopy={() => handleCopy(request._id)}
                      />
                    </TableCell>
                      <TableCell>{request.profile?.fullName}</TableCell>
                      <TableCell>{format(new Date(request.created_at), "yyyy-MM-dd HH:mm")}</TableCell>
                      <TableCell
                    className={`${
                      request.status === "Approved"
                        ? "text-green-500 dark:text-green-400"
                        : request.status === "Rejected"
                        ? "text-red-500 dark:text-red-400"
                        : request.status === "Under Review"
                        ? "text-teal-500 dark:text-teal-400"
                        : "text-yellow-500 dark:text-yellow-400"
                    }`}
                  >
                    {request.status}
                  </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="4"
                      className="text-center p-4 dark:text-gray-200"
                    >
                      No requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filteredRequests.length > 0 && totalPages > 0 && (
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="text-xs"
                variant="outline"
              >
                Previous
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="text-xs"
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PendingRequestdash;
