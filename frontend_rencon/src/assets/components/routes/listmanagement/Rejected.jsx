import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../ui/CopyableText";
import { Checkbox } from "@/components/ui/checkbox"; // Import Shadcn checkbox
import {
  Pagination,
  PaginationContent,
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

function Rejected({ searchQuery }) {
  const req_column = [
    "ID",
    "Requester Name",
    "Property Type",
    "Request Date",
    "Rejected Date",
    "Note",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
  const itemsPerPage = 20;

  const filteredRequests = rejectedRequests.filter((property) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const requestId = property._id ? property._id.toLowerCase() : "";
    const fullName = property.profile?.fullName
      ? property.profile.fullName.toLowerCase()
      : "";
    const createdAt = property.created_at
      ? format(new Date(property.created_at), "yyyy-MM-dd HH:mm").toLowerCase()
      : "";

    return (
      requestId.includes(lowerCaseQuery) ||
      fullName.includes(lowerCaseQuery) ||
      createdAt.includes(lowerCaseQuery)
    );
  })
  .sort((a, b) => {
    // Sort by created_at in descending order (new to old)
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleSelectRejRequest = (id) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(currentItems.map((property) => property._id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelectedRequests = async () => {
    if (selectedRequests.length === 0) return;

    try {
      // Send a DELETE request with the selected property IDs
      await axios.delete("/requests/deletion-properties", {
        data: { ids: selectedRequests },
      });

      // Update the state to remove the deleted requests
      setRejectedRequests((prevRequests) =>
        prevRequests.filter(
          (property) => !selectedRequests.includes(property._id)
        )
      );
      setSelectedRequests([]);
      setSelectAll(false);
      setDialogOpen(false); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting selected requests:", error);
    }
  };

  useEffect(() => {
    const fetchRejectedRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/requests/rejected-properties");
        setRejectedRequests(response.data || []);
      } catch (error) {
        console.error(
          "There was an error fetching the pending requests!",
          error
        );
        setRejectedRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedRequests();
  }, []);

  useEffect(() => {
    if (selectedRequests.length !== currentItems.length) {
      setSelectAll(false);
    } else if (
      selectedRequests.length === currentItems.length &&
      currentItems.length > 0
    ) {
      setSelectAll(true);
    }
  }, [selectedRequests, currentItems]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <Table className="min-w-full dark:border-zinc-600">
          <TableHeader>
            <TableRow className="border-b dark:border-zinc-600">
              <TableHead>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {req_column.map((column) => (
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
            {currentItems.length > 0 ? (
              currentItems.map((property) => (
                <TableRow key={property._id} className="cursor-pointer">
                  <TableCell>
                    <Checkbox
                      checked={selectedRequests.includes(property._id)}
                      onCheckedChange={() =>
                        handleSelectRejRequest(property._id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <CopyableText
                      text={property._id}
                      onCopy={() => console.log("Copying ID")}
                    />
                  </TableCell>
                  <TableCell>{property.profile?.fullName}</TableCell>
                  <TableCell>{property.typeOfProperty}</TableCell>
                  <TableCell>
                    {property.created_at
                      ? format(
                          new Date(property.created_at),
                          "yyyy-MM-dd HH:mm"
                        )
                      : "N/A"}
                  </TableCell>
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
                <TableCell colSpan={8} className="text-center">
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
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    className="px-4 py-2 rounded-md border border-gray-500 hover:border-white"
                    onClick={() => setDialogOpen(true)}
                  >
                    Delete
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the selected rejected
                      requests?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 mr-2 rounded-md text-gray-600"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-md bg-red-500 text-white"
                      onClick={handleDeleteSelectedRequests} // Call the delete function
                    >
                      Confirm
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rejected;
