import React, { useState } from "react";
import { format } from "date-fns";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import MapComponent from "../LocationMap";

function ReviewModal({
  isOpen,
  onClose,
  title,
  selectedRequest,
  showActionButtons,
  handleDoneReview,
  handleApprove,
  handleDecline,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !selectedRequest) return null;

  // Handle next image
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedRequest.property_photo.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  // Handle previous image
  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? selectedRequest.property_photo.length - 1
        : prevIndex - 1
    );
  };

  // Handle dot click to jump to specific image
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 text-white p-6 rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-4xl  shadow-lg">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
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

          <div className="mt-5">
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
            <div className="mb-5 flex items-center space-x-2">
              <h3 className="font-semibold">Type of Property:</h3>
              <p>{selectedRequest.typeOfProperty}</p>
            </div>

            <div className="mb-5">
              <h3 className="font-semibold py-2">Description</h3>
              <p>{selectedRequest.description}</p>
            </div>
            {selectedRequest.amenities.length > 0 ? (
              <>
                <h3 className="font-semibold py-2">Amenities Offer</h3>
                <ul class>
                  {selectedRequest.amenities.map((amenity, index) => (
                    <li key={index}>
                      <span className="text-teal-500 mr-2">•</span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <></>
            )}
            {/* Room Photos */}
            <div className="mt-5">
              <h3 className="font-semibold">Room/Unit Available</h3>
              <div className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedRequest.rooms.length > 0 ? (
                  selectedRequest.rooms.map((room, index) => (
                    <div key={index} className="relative">
                      {room.roomPhoto && room.roomPhoto.length > 0 ? (
                        <img
                          src={room.roomPhoto[0]} // Display the first photo of the room
                          alt={`Room ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
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

          {/* Done Review button */}
          <button
            onClick={handleDoneReview}
            className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
          >
            Done Review
          </button>

          {/* Action Buttons */}
          {showActionButtons && (
            <div className="space-x-4 mt-4">
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
