import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Pagination from "../../ui/Pagination";
import CopyableText from "../../ui/CopyableText";
import ReviewModal from "./modals/ReviewModal"; // Import the Modal component

function Pending({ searchQuery }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false); // State for approve modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showActionButtons, setShowActionButtons] = useState(false); // For "Done Review"

  const itemsPerPage = 20;

  const req_column = [
    "ID",
    "Requester Name",
    "Status",
    "Requested Date",
    "Action",
  ];

  useEffect(() => {
    axios
      .get("/requests/pending-requests")
      .then((response) => {
        setPendingRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the pending requests!",
          error
        );
        setError("Failed to fetch pending requests");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (pendingRequests.length === 0) {
    return <div>No data available</div>;
  }

  const handleReview = async (request) => {
    try {
      // Update status to "Under Review"
      await updateRequestStatus(request._id, "Under Review");

      // Set the selected request and open the modal
      setSelectedRequest(request);
      setShowReviewModal(true);
      setShowActionButtons(false); // Hide action buttons initially
    } catch (error) {
      console.error(
        `Error updating request status for ID: ${request._id}`,
        error
      );
      // Optionally, set an error state here
    }
  };

  const handleDoneReview = () => {
    setShowActionButtons(true); // Show Approve and Reject buttons
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

  const handleApprove = async () => {
    try {
      await updateRequestStatus(selectedRequest._id, "Approved");
      setShowReviewModal(false); // Close the modal after approval
      setSelectedRequest(null); // Clear the selected request
    } catch (error) {
      console.error("Error approving request", error);
    }
  };

  const handleDecline = async () => {
    try {
      await updateRequestStatus(selectedRequest._id, "Rejected");
      setShowReviewModal(false); // Close the modal after rejection
      setSelectedRequest(null); // Clear the selected request
    } catch (error) {
      console.error("Error rejecting request", error);
    }
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
      // Optionally, set an error state here
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
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-center text-sm">
          <thead>
            <tr className="border-b dark:border-zinc-600">
              {req_column.map((column) => (
                <th
                  key={column}
                  className="px-6 py-2 text-gray-600 dark:text-gray-200 font-bold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((request, index) => (
                <tr
                  key={request._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-zinc-700"
                      : "bg-white dark:bg-zinc-800"
                  }`}
                >
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200 relative">
                    <CopyableText text={request._id} />
                    {copiedId === request._id && (
                      <span className="text-green-500">Copied!</span>
                    )}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {request.profile.fullName}
                  </td>
                  <td
                    className={`px-6 py-2 font-medium ${
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
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {format(new Date(request.created_at), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex justify-center space-x-2">
                      <span
                        onClick={() => handleReview(request)}
                        className="cursor-pointer text-blue-500 hover:underline dark:text-blue-400"
                      >
                        Review
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 dark:text-gray-200">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleCancelReview}
          title={`Review Request - ${selectedRequest?._id}`}
          selectedRequest={selectedRequest}
          showActionButtons={showActionButtons}
          handleDoneReview={handleDoneReview}
          handleApprove={handleApprove}
          handleDecline={handleDecline}
        />
      )}

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredRequests.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Pending;
