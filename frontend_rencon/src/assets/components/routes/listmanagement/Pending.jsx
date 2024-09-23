import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../ui/CopyableText";
import ReviewModal from "./modals/ReviewModal"; // Import the Modal component
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

function Pending({ searchQuery }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // New states for confirmation popups
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const itemsPerPage = 20;

  const req_column = [
    "ID",
    "Requester Name",
    "Property Type",
    "Status",
    "Request Date",
    "Action",
  ];

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

  const handleReview = async (request) => {
    try {
      // Update status to "Under Review"
      await updateRequestStatus(request._id, "Under Review");

      // Set the selected request and open the modal
      setSelectedRequest(request);
      setShowReviewModal(true);
    } catch (error) {
      console.error(
        `Error updating request status for ID: ${request._id}`,
        error
      );
      // Optionally, set an error state here
    }
  };

  const handleCancelReview = async () => {
    try {
      await updateRequestStatus(selectedRequest._id, "Waiting");
      setShowReviewModal(false);
      setSelectedRequest(null); // Clear the selected request
    } catch (error) {
      console.error("Error reverting status to 'Waiting'", error);
    }
  };

  const handleApprove = () => {
    setConfirmAction("approve");
    setShowConfirmPopup(true);
  };

  const handleReject = () => {
    setConfirmAction("decline");
    setShowConfirmPopup(true);
  };

  const confirmApprove = async () => {
    try {
      await updateRequestStatus(selectedRequest._id, "Approved");
      setShowReviewModal(false); // Close the modal after approval
      setSelectedRequest(null); // Clear the selected request
      setShowConfirmPopup(false); // Hide the confirmation popup
    } catch (error) {
      console.error("Error approving request", error);
    }
  };

  const confirmDecline = async () => {
    try {
      await updateRequestStatus(selectedRequest._id, "Rejected");
      setShowReviewModal(false); // Close the modal after rejection
      setSelectedRequest(null); // Clear the selected request
      setShowConfirmPopup(false); // Hide the confirmation popup
    } catch (error) {
      console.error("Error rejecting request", error);
    }
  };

  const cancelApprove = () => {
    setShowConfirmPopup(false); // Hide the confirmation popup
  };

  const cancelDecline = () => {
    setShowConfirmPopup(false); // Hide the confirmation popup
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await axios.put(`/requests/${id}`, { status });
      console.log(`Status updated for request ID: ${id}`, response.data); // Log response
      setPendingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error(`Error updating status for request with ID: ${id}`, error);
    }
  };

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
              currentItems.map((request) => (
                <TableRow key={request._id}>
                  <TableCell className="px-6 py-2 ">
                    <CopyableText
                      text={request._id}
                      onCopy={() => handleCopy(request._id)}
                    />
                  </TableCell>
                  <TableCell>{request.profile?.fullName}</TableCell>
                  <TableCell>{request.typeOfProperty}</TableCell>
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

                  <TableCell>
                    {format(new Date(request.created_at), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => handleReview(request)}
                      className="cursor-pointer text-teal-400 hover:underline dark:text-teal-500"
                    >
                      Review
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center dark:text-gray-200"
                >
                  No properties available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleCancelReview}
          title={`Review Request - ${selectedRequest?._id}`}
          selectedRequest={selectedRequest}
          handleApprove={handleApprove}
          handleReject={handleReject}
          showConfirmPopup={showConfirmPopup}
          confirmAction={confirmAction}
          confirmApprove={confirmApprove}
          confirmDecline={confirmDecline}
          cancelApprove={cancelApprove}
          cancelDecline={cancelDecline}
        />
      )}

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
    </div>
  );
}

export default Pending;
