import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import OptionEllipsis from "./OptionEllipsis";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import CopyableText from "../../ui/CopyableText";
import ViewPropertyModal from "./modals/ViewPropertyModal"; // Import the modal

function Approved({ searchQuery }) {
  const [approvedProperty, setApprovedProperty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false); // Modal visibility state
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected property state
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const [propertyToDelete, setPropertyToDelete] = useState(null); // Property to delete state

  const { toast } = useToast();
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/requests/approved-properties");

        if (response.data && response.data.length > 0) {
          setApprovedProperty(response.data);
        } else {
          setApprovedProperty([]);
        }
      } catch (error) {
        console.error(
          "There was an error fetching the approved properties!",
          error
        );
        setError("Failed to fetch approved properties");
        setApprovedProperty([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRequests();
  }, []);

  const req_column = [
    "Property ID",
    "Owner's Name",
    "Property Type",
    "Address",
    "Rooms/Units Count",
    "Listed Date",
    "",
  ];

  const handleDelete = (property) => {
    setPropertyToDelete(property); // Set property to delete
    setDialogOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      // Send a DELETE request with the selected property ID
      const response = await axios.delete('/requests/deletion-properties', {
        data: { ids: [propertyToDelete._id] }
      });

      // Show success toast with message from backend
      toast({
        description: response.data.message, // message from backend
        variant: "success", // Use a success variant
      });

      // Update the state to remove the deleted request
      setApprovedProperty((prevRequests) =>
        prevRequests.filter((property) => property._id !== propertyToDelete._id)
      );

      setDialogOpen(false); // Close dialog after deletion
      setPropertyToDelete(null); // Reset property to delete
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        description: error.message || "Failed to delete property.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleView = (property) => {
    setSelectedRequest(property); // Set the selected property
    setShowViewModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowViewModal(false); // Close the modal
    setSelectedRequest(null); // Clear selected request
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredRequests = approvedProperty
    .filter((property) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const requestId = property._id ? property._id.toLowerCase() : "";
      const fullName = property.profile?.fullName
        ? property.profile.fullName.toLowerCase()
        : "";
      const address = property.address ? property.address.toLowerCase() : "";
      const createdAt = property.created_at
        ? format(
            new Date(property.created_at),
            "yyyy-MM-dd HH:mm"
          ).toLowerCase()
        : "";

      return (
        requestId.includes(lowerCaseQuery) ||
        fullName.includes(lowerCaseQuery) ||
        address.includes(lowerCaseQuery) ||
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

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <Table className="min-w-full  dark:border-zinc-600">
          <TableHeader>
            <TableRow className="border-b dark:border-zinc-600">
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
                <TableRow key={property._id} className="cursor-pointer">
                  <TableCell>
                    <CopyableText
                      text={property._id}
                      onCopy={() => handleCopy(property._id)}
                    />
                  </TableCell>
                  <TableCell>{property.profile?.fullName}</TableCell>
                  <TableCell>{property.typeOfProperty}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.roomCount}</TableCell>
                  <TableCell>
                    {format(new Date(property.created_at), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="w-10 pl-0 text-center">
                    <OptionEllipsis
                      onView={() => handleView(property)} // View action
                      onDelete={() => handleDelete(property)} // Delete action
                      onSuspend={() => handleSuspend(property)} // Suspend action
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
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

      {showViewModal && selectedRequest && (
        <ViewPropertyModal
          selectedRequest={selectedRequest}
          title={`Property ID - ${selectedRequest?._id}`}
          closeModal={closeModal} // Pass function to close the modal
        />
      )}

      {/* Confirmation Dialog for Delete */}
      {dialogOpen && propertyToDelete && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="pb-3">Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the property with ID:{" "}
                <strong>{propertyToDelete._id}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 mr-2 rounded-md text-gray-600"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </div>
  );
}

export default Approved;
