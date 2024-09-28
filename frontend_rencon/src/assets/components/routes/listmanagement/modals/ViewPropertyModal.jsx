import React, { useState } from "react";
import { format } from "date-fns";
import MapComponent from "../LocationMap";
import LegalDocuments from "./LegalDocs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ViewPropertyModal({ selectedRequest, title, closeModal }) {

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="max-w-md md:max-w-2xl lg:max-w-4xl absolute p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="p-5" style={{ maxHeight: "600px" }}>
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
                    <div className="relative flex items-center justify-center w-full py-5">
                      <Carousel className="w-full max-w-3xl">
                        {" "}
                        {/* Adjust carousel size */}
                        <CarouselPrevious
                          className="absolute left-0 z-10 bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                          style={{ transform: "translateX(-50%)" }} // Ensure the button is visible outside the image
                        >
                        </CarouselPrevious>
                        <CarouselContent>
                          {selectedRequest.property_photo.map(
                            (photo, index) => (
                              <CarouselItem
                                key={index}
                                className="flex justify-center items-center"
                              >
                                <img
                                  src={photo}
                                  alt={`Property ${index + 1}`}
                                  className="w-full max-w-3xl h-full object-cover rounded-lg"
                                  style={{ objectFit: "cover" }}
                                />
                              </CarouselItem>
                            )
                          )}
                        </CarouselContent>
                        <CarouselNext
                          className="absolute right-0 z-10 bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                          style={{ transform: "translateX(50%)" }} // Ensure the button is visible outside the image
                        >
                        </CarouselNext>
                        <CarouselDots />
                      </Carousel>
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
                            <Carousel>
                              <CarouselContent>
                                {room.roomPhoto.map((room, index) => (
                                  <CarouselItem
                                    key={index}
                                    className="flex justify-center items-center"
                                  >
                                    <img
                                      src={room}
                                      alt={`Room ${index + 1}`}
                                      className="w-full h-40 object-cover rounded-lg"
                                      style={{ objectFit: "cover" }}
                                    />
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                            </Carousel>
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
                            <p className="text-sm">
                              <strong>Status: </strong>
                              <span
                                className={`font-semibold ${
                                  room.status === "occupied"
                                    ? "text-teal-500"
                                    : room.status === "available"
                                    ? "text-green-500"
                                    : "text-gray-500" // default color if status is neither
                                }`}
                              >
                                {room.status}
                              </span>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ViewPropertyModal;
