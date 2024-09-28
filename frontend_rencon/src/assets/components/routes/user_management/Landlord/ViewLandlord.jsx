import React from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ViewLandlordModal({ landlordToView, title, closeModal }) {
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="max-w-md md:max-w-2xl lg:max-w-3xl absolute p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="p-5" style={{ maxHeight: "600px" }}>
            <div className="flex items-center space-x-10 border-b pb-6">
              <div>
              <Avatar className="w-24 h-24 lg:w-36 lg:h-36 rounded-full">
                  {landlordToView?.profilePicture ? (
                    <AvatarImage
                      src={landlordToView.profilePicture}
                      alt="user_photo"
                    />
                  ) : (
                    <AvatarFallback>
                      <FaUserCircle className="text-9xl" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
                  <div className="space-y-3">
                    <p>
                      <strong>Name: </strong>
                      {landlordToView.fullName}
                    </p>
                    <p>
                      <strong>Gender: </strong>
                      {landlordToView.gender}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      {landlordToView.email}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p>
                      <strong>Phone Number: </strong>
                      {landlordToView.contactDetails.phone}
                    </p>
                    <p>
                      <strong>Address: </strong>
                      {landlordToView.contactDetails.address}
                    </p>
                    <p>
                      <strong>Registered Date: </strong>
                      {format(
                        new Date(landlordToView.created_at),
                        "MMMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-6">
              <h2>
                <strong>Listed Properties:</strong>
              </h2>
              <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {landlordToView.properties.length > 0 ? (
                  landlordToView.properties.map((property, index) => (
                    <div key={index} className="relative">
                      {property.property_photo && property.property_photo.length > 0 ? (
                        <div className="mb-4 space-y-2">
                          <Carousel>
                            <CarouselContent>
                              {property.property_photo.map((photo, index) => (
                                <CarouselItem
                                  key={index}
                                  className="flex justify-center items-center"
                                >
                                  <img
                                    src={photo}
                                    alt={`property ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-lg"
                                    style={{ objectFit: "cover" }}
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          </Carousel>
                          <p className="text-sm">
                            <strong>Property Id: </strong> {property.property_id}
                          </p>
                          <p className="text-sm">
                            <strong>No. of Room/Unit: </strong> {property.roomCount}
                          </p>
                        </div>
                      ) : (
                        <p>No property photos available</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No property available</p>
                )}
              </div>
            </div>
            <div>
              <h1><strong>Occupants </strong>/*count*/ </h1>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ViewLandlordModal;
