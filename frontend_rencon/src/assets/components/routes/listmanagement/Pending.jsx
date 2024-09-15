// src/components/Pending.js
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
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
        console.error("There was an error fetching the pending requests!", error);
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

  const handleReview = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const handleApprove = (id) => {
    console.log(`Approve request with ID: ${id}`);
  };

  const handleDecline = async (id) => {
    setSelectedRequest(id);
    setShowConfirmPopup(true);
  };

  const confirmDecline = async () => {
    try {
      await axios.post(`/requests/${selectedRequest}/reject`, {
        status: "Rejected",
      });

      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== selectedRequest)
      );

      setShowConfirmPopup(false);
      setSelectedRequest(null);
      console.log(`Request with ID: ${selectedRequest} has been moved to rejected collection`);
    } catch (error) {
      console.error(`Error rejecting request with ID: ${selectedRequest}`, error);
    }
  };

  const cancelDecline = () => {
    setShowConfirmPopup(false);
    setSelectedRequest(null);
  };

  const filteredRequests = pendingRequests.filter((request) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const requestId = request._id ? request._id.toLowerCase() : "";
    const fullName = request.profile?.fullName ? request.profile.fullName.toLowerCase() : "";
    const status = request.status ? request.status.toLowerCase() : "";
    const createdAt = request.created_at ? format(new Date(request.created_at), "yyyy-MM-dd HH:mm").toLowerCase() : "";

    return (
      requestId.includes(lowerCaseQuery) ||
      fullName.includes(lowerCaseQuery) ||
      status.includes(lowerCaseQuery) ||
      createdAt.includes(lowerCaseQuery)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

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
                      <span className="text-gray-400 dark:text-gray-500">|</span>
                      <span
                        onClick={() => handleApprove(request._id)}
                        className="cursor-pointer text-green-500 hover:underline dark:text-green-400"
                      >
                        Approve
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">|</span>
                      <span
                        onClick={() => handleDecline(request._id)}
                        className="cursor-pointer text-red-500 hover:underline dark:text-red-400"
                      >
                        Decline
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

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 text-white p-6 rounded-lg max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Decline</h2>
            <p className="mb-6">Are you sure you want to decline this request?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={cancelDecline}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                onClick={confirmDecline}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          title={`Review Request - ${selectedRequest._id}`}
        >
          <div className="space-y-4">
            <p><strong>ID:</strong> {selectedRequest._id}</p>
            <p><strong>Requester Name:</strong> {selectedRequest.profile.fullName}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Requested Date:</strong> {format(new Date(selectedRequest.created_at), "yyyy-MM-dd HH:mm")}</p>
            {/* Add more details as needed */}
          </div>
        </ReviewModal>
      )}

      <Pagination
        totalItems={filteredRequests.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Pending;
