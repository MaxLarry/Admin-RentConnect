import React, { useState } from "react";
import { format } from "date-fns";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import MapComponent from "../LocationMap";
import LegalDocuments from "./LegalDocs";
import { AiOutlineClose } from "react-icons/ai"; // Importing the X icon

function ViewPropertyModal({ selectedRequest, closeModal }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      {/* Close Button inside the modal */}
      <button
        onClick={closeModal}
        className="absolute top-2 right-9 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
      >
        <AiOutlineClose size={24} />
      </button>
      <div className="relative bg-zinc-800 text-white p-6 rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-4xl shadow-lg">
        <div
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
            {/* Property details and rooms */}
            {/* Rest of the code */}
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
        </div>
      </div>
    </div>
  );
}

export default ViewPropertyModal;
