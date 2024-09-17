import React, { useState } from "react";
import { format } from "date-fns";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import MapComponent from "../LocationMap";
import LegalDocuments from "./LegalDocs";
import { REVIEW_ISSUES } from "../../../../constants";
import { ScrollArea } from "@/components/ui/scroll-area"

function ReviewModal({
  isOpen,
  onClose,
  title,
  selectedRequest,
  handleApprove,
  handleReject,
  showConfirmPopup,
  confirmAction,
  confirmApprove,
  confirmDecline,
  cancelApprove,
  cancelDecline,
}) {
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [additionalComments, setAdditionalComments] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const handleCheckboxChange = (issue) => {
    setSelectedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((item) => item !== issue)
        : [...prev, issue]
    );
  };

  const handleCommentsChange = (e) => {
    setAdditionalComments(e.target.value);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : selectedRequest.property_photo.length - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev < selectedRequest.property_photo.length - 1 ? prev + 1 : 0
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 text-white p-6 rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-4xl shadow-lg">
        <h2 className="text-lg font-semibold mb-5">{title}</h2>
        <ScrollArea
          className="p-4 overflow-y-auto border-y border-zinc-700"
          style={{ maxHeight: "600px" }}
        >
          <div className="text-sm">
            <p>
              <strong>Requester Name: </strong>
              {selectedRequest.profile.fullName}
            </p>
            <p>
              <strong>Requested Date: </strong>
              {format(new Date(selectedRequest.created_at), "yyyy-MM-dd HH:mm")}
            </p>
          </div>

          <div className="mt-5 border-b border-zinc-700">
            <h2>
              <strong>I. Property Information</strong>
            </h2>
            <div className="relative">
              {/* Image Slider */}
              {selectedRequest.property_photo.length > 0 ? (
                <div className="flex flex-col items-center justify-center w-full py-5">
                  <div className="relative w-96 flex items-center justify-center bg-white rounded-lg">
                    <button
                      onClick={handlePrev}
                      className="absolute left-2 bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600"
                    >
                      <MdNavigateBefore size={24} />
                    </button>
                    <img
                      src={selectedRequest.property_photo[currentImageIndex]}
                      alt={`Property ${currentImageIndex + 1}`}
                      className="max-w-full max-h-64 rounded-lg"
                    />
                    <button
                      onClick={handleNext}
                      className="absolute right-2 bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600"
                    >
                      <MdNavigateNext size={24} />
                    </button>
                  </div>

                  {/* Dots for Image Navigation */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {selectedRequest.property_photo.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-2 w-2 rounded-full ${
                          currentImageIndex === index
                            ? "bg-teal-500"
                            : "bg-gray-400"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="mb-3 flex items-center space-x-2">
              <h2 className="font-semibold">Type of Property:</h2>
              <p>{selectedRequest.typeOfProperty}</p>
            </div>
            <div className="mb-3 flex items-center space-x-2">
              <h2 className="font-semibold">Address:</h2>
              <p>{selectedRequest.address}</p>
            </div>

            <div className="mb-5">
              <h2 className="font-semibold">Description</h2>
              <p>{selectedRequest.description}</p>
            </div>
            {selectedRequest.amenities.length > 0 ? (
              <>
                <h2 className="font-semibold">Amenities Offer</h2>
                <ul className="list-disc list-inside pl-5">
                  {selectedRequest.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-teal-500 mr-2">•</span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {/* Room Photos */}
            <div className="mt-5">
              <h2 className="font-semibold">Room/Unit Available</h2>
              <div className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedRequest.rooms.length > 0 ? (
                  selectedRequest.rooms.map((room, index) => (
                    <div key={index} className="relative">
                      {room.roomPhoto && room.roomPhoto.length > 0 ? (
                        <div className="mb-4">
                          <img
                            src={room.roomPhoto[0]} // Display the first photo of the room
                            alt={`Room ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <p className="mt-2 text-sm">
                            <strong>Room Number:</strong> {room.roomNumber}
                          </p>
                          <p className="mt-1 text-sm">
                            <strong>Capacity:</strong> {room.capacity}
                          </p>
                          <p className="mt-1 text-sm">
                            <strong>Deposit:</strong> {room.deposit} Month
                          </p>
                          <p className="mt-1 text-sm">
                            <strong>Advance:</strong> {room.advance} Month
                          </p>
                          <p className="mt-1 text-sm">
                            <strong>Price:</strong> ₱{room.price}
                          </p>
                        </div>
                      ) : (
                        <p>No room photos available</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No rooms available</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 py-5 border-b border-zinc-700">
            <h2 className="mb-3">
              <strong>II. Geographical Location</strong>
            </h2>
            <div className="flex justify-center relative z-10">
              <MapComponent
                location={{ coordinates: selectedRequest.location.coordinates }}
              />
            </div>
          </div>
          <LegalDocuments selectedRequest={selectedRequest} />
          <div className="mb-5 py-3">
            {/* Action Buttons */}
            <div className="flex justify-center space-x-10">
              <span
                onClick={handleApprove}
                className="py-2 px-4 cursor-pointer text-white bg-green-600 hover:bg-green-500 rounded"
              >
                Approve Request
              </span>
              <span
                onClick={handleReject}
                className="py-2 px-4 cursor-pointer text-white bg-red-600 hover:bg-red-500 rounded"
              >
                Reject Request
              </span>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end mt-4">
          <button
            className="px-5 py-2 bg-gray-600 border border-gray-500 text-white rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Confirmation Popup for Decline */}
      {showConfirmPopup && confirmAction === "decline" && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 text-white p-6 rounded-lg max-w-sm shadow-lg w-full md:max-w-xl lg:max-w-2xl">
            <p className="mb-4 text-center">
              Are you sure you want to decline this request?
            </p>
            <div className="text-left">
              <p className="mb-4">Please select the reason(s) for rejection:</p>
              <form>
                {REVIEW_ISSUES.map((issue) => (
                  <div key={issue} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={issue}
                      checked={selectedIssues.includes(issue)}
                      onChange={() => handleCheckboxChange(issue)}
                      className="mr-2 rounded focus:outline-none focus:ring-transparent text-teal-400"
                    />
                    <label className="text-sm" htmlFor={issue}>
                      {issue}
                    </label>
                  </div>
                ))}
              </form>
              <div className="mt-4">
                <p className="mb-2">Additional reason/comments:</p>
                <textarea
                  value={additionalComments}
                  onChange={handleCommentsChange}
                  rows="4"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-200 text-zinc-900 focus:outline-none focus:ring-teal-500"
                  placeholder="Enter additional reasons or comments here..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() =>
                  confirmDecline({ selectedIssues, additionalComments })
                }
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={cancelDecline}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup for Approve */}
      {showConfirmPopup && confirmAction === "approve" && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 text-white p-6 rounded-lg max-w-sm shadow-lg text-center">
            <p className="mb-4">
              Are you sure you want to approve this request?
            </p>
            <button
              onClick={confirmApprove}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Confirm
            </button>
            <button
              onClick={cancelApprove}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewModal;
