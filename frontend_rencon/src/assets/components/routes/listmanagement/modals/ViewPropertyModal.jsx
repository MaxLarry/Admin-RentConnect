import React, { useState } from "react";
import { format } from "date-fns";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import MapComponent from "../LocationMap";
import LegalDocuments from "./LegalDocs";
import { AiOutlineClose } from "react-icons/ai"; // Importing the X icon
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ViewPropertyModal({ selectedRequest, title, closeModal }) {
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
        className="absolute top-2 right-9 p-2 bg-gray-700 rounded-full hover:bg-gray-600"
      >
        <AiOutlineClose size={24} />
      </button>
      <Card className="relative  p-6 rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-4xl shadow-lg ">
        <CardHeader className="p-5 border-b">
          <CardTitle>Property Details</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <ScrollArea>
          <CardContent
          className="p-5"
            style={{ maxHeight: "600px" }}
          >
            <div className="text-sm space-y-2">
              <p>
                <strong>Owner's Name: </strong>
                {selectedRequest.profile.fullName}
              </p>
              <p>
                <strong>Email: </strong>
                {selectedRequest.profile.email}
              </p>
              <p>
                <strong>Phone Number: </strong>
                {selectedRequest.profile.contactDetails.phone}
              </p>
              <p>
                <strong>Listed Date: </strong>
                {format(
                  new Date(selectedRequest.created_at),
                  "yyyy-MM-dd HH:mm"
                )}
              </p>
            </div>

            <div className="my-5 border-b">
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
                        className="absolute left-2 bg-gray-700 p-2 rounded-full hover:bg-gray-600"
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
                        className="absolute right-2 bg-gray-700 p-2 rounded-full hover:bg-gray-600"
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
              <div className="mb-3 flex items-center space-x-2 text-sm">
                <h2 className="font-bold">Type of Property:</h2>
                <p>{selectedRequest.typeOfProperty}</p>
              </div>
              <div className="mb-3 flex items-center space-x-2 text-sm">
                <h2 className="font-bold">Address:</h2>
                <p>{selectedRequest.address}</p>
              </div>

              <div className="mb-5 text-sm">
                <h2 className="font-bold">Description</h2>
                <p>{selectedRequest.description}</p>
              </div>
              {selectedRequest.amenities.length > 0 ? (
                <div className="text-sm">
                  <h2 className="font-bold">Amenities Offer</h2>
                  <ul className="list-disc list-inside pl-5">
                    {selectedRequest.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-teal-500 mr-2">•</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {/* Room Photos */}
              <div className="mt-5 text-sm">
                <h2 className="font-bold">Room/Unit Available</h2>
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedRequest.rooms.length > 0 ? (
                    selectedRequest.rooms.map((room, index) => (
                      <div key={index} className="relative">
                        {room.roomPhoto && room.roomPhoto.length > 0 ? (
                          <div className="mb-4 space-y-2">
                            <img
                              src={room.roomPhoto[0]} // Display the first photo of the room
                              alt={`Room ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <p className="text-sm">
                              <strong>Room Number:</strong> {room.roomNumber}
                            </p>
                            <p className="text-sm">
                              <strong>Capacity:</strong> {room.capacity}
                            </p>
                            <p className="text-sm">
                              <strong>Deposit:</strong> {room.deposit} Month
                            </p>
                            <p className="text-sm">
                              <strong>Advance:</strong> {room.advance} Month
                            </p>
                            <p className="text-sm">
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
            <div className="mt-2 py-5 border-b">
              <h2 className="mb-3">
                <strong>II. Geographical Location</strong>
              </h2>
              <div className="flex justify-center relative z-10">
                <MapComponent
                  location={{
                    coordinates: selectedRequest.location.coordinates,
                  }}
                />
              </div>
            </div>
            <LegalDocuments selectedRequest={selectedRequest} />
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}

export default ViewPropertyModal;
