import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../ui/CopyableText";
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

function Rejected({ searchQuery }) {
  const req_column = [
    "Select",
    "ID",
    "Requester Name",
    "Property Type",
    "Requested Date",
    "Rejected Date",
    "Note",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRequests, setSelectedRequests] = useState([]); // List of selected requests
  const [selectAll, setSelectAll] = useState(false);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const itemsPerPage = 20;

  const filteredRequests = rejectedRequests.filter((property) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const requestId = property._id ? property._id.toLowerCase() : "";
    const fullName = property.profile?.fullName
      ? property.profile.fullName.toLowerCase()
      : "";

    return (
      requestId.includes(lowerCaseQuery) || fullName.includes(lowerCaseQuery)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle select/unselect individual requests
  const handleSelectRejRequest = (id) => {
    setSelectedRequests(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id) // Unselect
          : [...prevSelected, id] // Select
    );
  };

  // Handle select/unselect all requests
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRequests([]); // Unselect all
    } else {
      setSelectedRequests(currentItems.map((property) => property._id)); // Select all visible requests
    }
    setSelectAll(!selectAll);
  };
  useEffect(() => {
    // Fetch rejected requests only when the component mounts
    const fetchRejectedRequests = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("/requests/rejected-properties");
        if (response.data && response.data.length > 0) {
          setRejectedRequests(response.data);
        } else {
          setRejectedRequests([]); // No data available
        }
      } catch (error) {
        console.error(
          "There was an error fetching the pending requests!",
          error
        );
        setRejectedRequests([]); // Set to empty array in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchRejectedRequests();
  }, []); // Empty dependency array means this runs only once, when the component mounts

  // Separate useEffect for managing the "select all" state
  useEffect(() => {
    if (selectedRequests.length !== currentItems.length) {
      setSelectAll(false);
    } else if (
      selectedRequests.length === currentItems.length &&
      currentItems.length > 0
    ) {
      setSelectAll(true);
    }
  }, [selectedRequests, currentItems]); // Runs whenever selectedRequests or currentItems change

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <Table className="min-w-full  dark:border-zinc-600">
          <TableHeader>
            <TableRow className="border-b dark:border-zinc-600">
              <TableHead>
                <input
                  className="rounded-md focus:outline-none focus:ring-transparent text-teal-400"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </TableHead>
              {req_column.map((column) => (
                <TableHead
                  key={column}
                  className=" text-zinc-900 dark:text-gray-200 font-bold"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((property, index) => (
                <TableRow key={property._id} className={`cursor-pointer }`}>
                  <TableCell>
                    <input
                      className="rounded-md focus:outline-none focus:ring-transparent text-teal-400"
                      type="checkbox"
                      checked={selectedRequests.includes(property._id)}
                      onChange={() => handleSelectRejRequest(property._id)}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-2 ">
                    <CopyableText
                      text={property._id}
                      onCopy={() => handleCopy(property._id)}
                    />
                  </TableCell>
                  <TableCell>{property.profile?.fullName}</TableCell>
                  <TableCell>{property.typeOfProperty}</TableCell>
                  <TableCell>
                  {property.rejected_at
                      ? format(
                          new Date(property.rejected_at),
                          "yyyy-MM-dd HH:mm"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>{property.note || "No notes available"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center"
                >
                  No properties available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredRequests.length > 0 && totalPages >= 1 && (
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
      {/* Popup Effect for Selected Items */}
      {selectedRequests.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="fixed bottom-5 max-w-fit border rounded-lg text-sm shadow-md border-zinc-700 bg-zinc-800 text-white p-4 flex justify-between gap-10 items-center transition-transform transform translate-y-0 animate-slide-up">
            <div className="flex gap-3">
              <div className="text-gray-200 bg-teal-400 px-2 rounded-md">
                {selectedRequests.length}
              </div>
              <p>Rejected Request(s) Selected</p>
            </div>
            <div>
              <button
                className="px-4 py-2 mr-2 rounded- text-white hover:text-gray-400"
                onClick={() => setSelectedRequests([])}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md border border-gray-500 hover:border-white"
                onClick={() => console.log("Delete selected requests")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rejected;
