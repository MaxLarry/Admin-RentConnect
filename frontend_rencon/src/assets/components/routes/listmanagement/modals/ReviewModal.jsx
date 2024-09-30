import React, { useState } from "react";
import { format } from "date-fns";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import MapComponent from "../LocationMap";
import LegalDocuments from "./LegalDocs";
import { REVIEW_ISSUES } from "../../../../constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <Card className="relative  p-6 rounded-lg w-full max-w-md md:max-w-2xl lg:max-w-4xl shadow-lg ">
        <CardHeader className="p-5 border-b">
          <CardTitle>Request Property Details</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <ScrollArea>
          <CardContent className="p-5" style={{ maxHeight: "500px" }}>
            <div className="text-sm space-y-2">
              <p>
                <strong>Requester's Name: </strong>
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
                <strong>Request Date: </strong>
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
                          <MdNavigateBefore size={24} />
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
                          <MdNavigateNext size={24} />
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
            <div className="mb-5 py-3 flex justify-center space-x-5">
              <span
                onClick={handleApprove}
                className="py-2 px-4 cursor-pointer bg-green-600 hover:bg-green-500 rounded"
              >
                Approve Request
              </span>
              <span
                onClick={handleReject}
                className="py-2 px-4 cursor-pointer bg-red-600 hover:bg-red-500 rounded"
              >
                Reject Request
              </span>
            </div>
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex justify-end mt-4 py-0">
          <Button
            className="px-5 py-2 border rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Popup for Decline */}
      {showConfirmPopup && confirmAction === "decline" && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg max-w-sm shadow-lg w-full md:max-w-xl lg:max-w-2xl">
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
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={cancelDecline}
                className="bg-gray-500 hover:bg-gray-600  px-4 py-2 rounded"
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
          <div className="bg-zinc-800 p-6 rounded-lg max-w-sm shadow-lg text-center">
            <p className="mb-4">
              Are you sure you want to approve this request?
            </p>
            <button
              onClick={confirmApprove}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
            >
              Confirm
            </button>
            <button
              onClick={cancelApprove}
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
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
