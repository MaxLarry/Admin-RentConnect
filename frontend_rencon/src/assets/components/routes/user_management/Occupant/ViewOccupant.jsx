import React from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaUserCircle } from "react-icons/fa";
import CopyableText from "@/assets/components/ui/CopyableText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ViewLandlordModal({ occupantToView, title, closeModal }) {
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="max-w-md md:max-w-2xl lg:max-w-3xl absolute p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="p-5" style={{ maxHeight: "600px" }}>
            {/* User Profile Section */}
            <div className="flex items-center space-x-10 border-b pb-6">
              <div>
                <Avatar className="w-24 h-24 lg:w-36 lg:h-36 rounded-full">
                  {occupantToView?.profilePicture ? (
                    <AvatarImage
                      src={occupantToView.profilePicture}
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
                      {occupantToView.fullName}
                    </p>
                    <p>
                      <strong>Gender: </strong>
                      {occupantToView.gender}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      {occupantToView.email}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p>
                      <strong>Phone Number: </strong>
                      {occupantToView.contactDetails.phone}
                    </p>
                    <p>
                      <strong>Address: </strong>
                      {occupantToView.contactDetails.address}
                    </p>
                    <p>
                      <strong>Registered Date: </strong>
                      {format(
                        new Date(occupantToView.created_at),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Property Rented Section */}
            <div className="py-6">
              <h1 className="text-lg font-bold">Current Property Rented</h1>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Property ID</TableHead>
                    <TableHead>Landlord Name</TableHead>
                    <TableHead>Room ID</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Rented Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {occupantToView.currentProperty.length> 0 ? (
                      occupantToView.currentProperty.map((property, index) => (
                    <TableRow key={index}>
                      <TableCell>
                      <CopyableText
                      text={property.propertyId
                        ? property.propertyId
                        : "N/A"}
                      onCopy={() => handleCopy(property.propertyId)}
                    />
                      </TableCell>
                      <TableCell>
                        {property.landlordName
                          ? property.landlordName
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                      <CopyableText
                      text={property.roomId
                        ? property.roomId
                        : "N/A"}
                      onCopy={() => handleCopy(property.roomId)}
                    />
                        
                      </TableCell>
                      <TableCell>
                        {property.propertyAddress
                          ? property.propertyAddress
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {property.rentedDate
                          ? format(
                              new Date(
                                property.rentedDate
                              ),
                              "MMMM dd, yyyy hh:mm a"
                            )
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                 )) ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No current property rented.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Rental History Section */}
            {/* <div className="py-6">
              <h1 className="text-lg font-bold">Rental History</h1>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Property ID</TableHead>
                    <TableHead>Landlord Name</TableHead>
                    <TableHead>Room ID</TableHead>
                    <TableHead>Rented Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {occupantToView.rentalHistory.map((history, index) => (
                    <TableRow key={index}>
                      <TableCell>{history?.propertyId ? history.propertyId : "N/A"}</TableCell>
                      <TableCell>{history?.landlordName ? history.landlordNmae  : "N/A"}</TableCell>
                      <TableCell>{history?.roomId ? history.roomId : "N/A"}</TableCell>
                      <TableCell>
                      {history?.rentedDate
                      ? format(new Date(history.rentedDate), "MMMM dd, yyyy hh:mm a")
                      : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div> */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ViewLandlordModal;
