import React from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ViewLandlordModal({ adminToView, title, closeModal }) {
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="max-w-md md:max-w-2xl lg:max-w-3xl absolute p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Admin Details</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="p-5" style={{ maxHeight: "600px" }}>
            <div className="flex items-center space-x-10 border-b pb-6">
              <div>
                <Avatar className="w-24 h-24 lg:w-36 lg:h-36 rounded-full">
                  {adminToView?.profilePicture ? (
                    <AvatarImage
                      src={adminToView.profilePicture}
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
                      {adminToView.fullName}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      {adminToView.email}
                    </p>
                    <p>
                      <strong>Phone Number: </strong>
                      {adminToView.phone_num}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p>
                      <strong>Role: </strong>
                      {adminToView.role}
                    </p>
                    <p>
                      <strong>Created Date: </strong>
                      {format(
                        new Date(adminToView.created_at),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-6">
              <h2>
                <strong>Activity Logs</strong>
              </h2>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ViewLandlordModal;
