import React, { useState } from "react";
import { format } from "date-fns";
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function ReviewModal({
  requestToView,
  title,
  closeModal,
  onApprove,
  onReject,
  handleApprove,
  handleReject,
  showConfirmPopup,
  confirmAction,
  confirmApprove,
  confirmDecline,
  cancelApprove,
  cancelDecline,
}) {
  const [isImageOpen, setIsImageOpen] = useState(false); // State to control the large image view
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openImageModal = () => {
    setIsImageOpen(true); // Open the image modal
  };

  const closeImageModal = () => {
    setIsImageOpen(false); // Close the image modal
  };

  const openConfirmModal = (action) => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  return (
    <>
      <Dialog open={true} onOpenChange={closeModal}>
        <DialogContent className="max-w-md md:max-w-2xl lg:max-w-3xl absolute p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>User Request Submitted Details</DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>
          <ScrollArea>
            <div className="p-5" style={{ maxHeight: "600px" }}>
              <div className="flex items-center space-x-10 border-b pb-6">
                <Avatar className="w-24 h-24 lg:w-36 lg:h-36 rounded-full">
                  {requestToView?.profilePicture ? (
                    <AvatarImage
                      src={requestToView.profilePicture}
                      alt="user_photo"
                    />
                  ) : (
                    <AvatarFallback>
                      <FaUserCircle className="text-9xl" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
                    <div className="space-y-3">
                      <p>
                        <strong>Name: </strong>
                        {requestToView.fullName}
                      </p>
                      <p>
                        <strong>Gender: </strong>
                        {requestToView.gender}
                      </p>
                      <p>
                        <strong>Email: </strong>
                        {requestToView.email}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p>
                        <strong>Phone Number: </strong>
                        {requestToView.contactDetails.phone}
                      </p>
                      <p>
                        <strong>Address: </strong>
                        {requestToView.contactDetails.address}
                      </p>
                      <p>
                        <strong>Request Date: </strong>
                        {format(
                          new Date(requestToView.dateRequest),
                          "MMMM dd, yyyy a"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <p>
                  <strong>Request user as: {requestToView.role}</strong>
                </p>
              </div>
              <div className="pt-6">
                <p>
                  <strong>Identification Card</strong>
                </p>
                <div className="pt-4">
                  <div
                    className="relative w-52 h-28 cursor-pointer group"
                    onClick={openImageModal} // Open large view on click
                  >
                    <img
                      src={requestToView.valid_id}
                      alt="ID"
                      className="object-cover rounded-md w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white">Click to view</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Buttons for Approve and Reject inside the DialogContent */}
          <DialogFooter className="flex justify-end mt-4 py-0">
            <Button
              onClick={handleApprove}
              variant="outline"
              className=" text-green-500 hover:text-green-600"
            >
              Approve
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="text-red-500 hover:text-red-600"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for large image view */}
      <Dialog open={isImageOpen} onOpenChange={closeImageModal}>
        <DialogContent className="p-0 max-w-5xl rounded-lg overflow-hidden">
          <img
            src={requestToView.valid_id}
            alt="Large View ID"
            className="w-full h-full object-contain"
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Popup for Approve */}
      {showConfirmPopup && confirmAction === "approve" && (
        <Dialog open={showConfirmPopup} onOpenChange={closeConfirmModal}>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DialogContent className="p-6 max-w-lg rounded-lg text-center">
            <p className="mb-4">
              Are you sure you want to approve this verification request?
            </p>
            <div className="flex justify-center space-x-2">
            <Button
              onClick={confirmApprove}
              variant="outline"
              className="text-green-500 hover:text-green-600 "
            >
              Confirm
            </Button>
            <Button
              onClick={cancelApprove}
              variant="outline"
              className="text-red-500 hover:text-red-600 "
            >
              Cancel
            </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Popup for Decline */}
      {showConfirmPopup && confirmAction === "decline" && (
        <Dialog open={showConfirmPopup} onOpenChange={closeConfirmModal}>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DialogContent className="p-6 max-w-lg rounded-lg">
            <p className="mb-4 text-center">
              Are you sure you want to decline this verification request?
            </p>
            <div className="flex justify-center space-x-2">
              <Button
                onClick={confirmDecline}
                variant="outline"
                className="text-red-500 hover:text-red-600"
              >
                Confirm
              </Button>
              <Button
                onClick={cancelDecline}
                variant="outline"
                className="text-gray-500 hover:text-gray-600"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ReviewModal;
