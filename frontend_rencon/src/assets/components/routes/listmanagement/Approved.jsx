import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CopyableText from "../../ui/CopyableText";
import ViewPropertyModal from "./modals/ViewPropertyModal"; // Import the modal

function Approved({ searchQuery }) {
  const [approvedProperty, setApprovedProperty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false); // Modal visibility state
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected property state

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/requests/approved-properties");

        if (response.data && response.data.length > 0) {
          setApprovedProperty(response.data);
        } else {
          setApprovedProperty([]);
        }
      } catch (error) {
        console.error(
          "There was an error fetching the approved properties!",
          error
        );
        setError("Failed to fetch approved properties");
        setApprovedProperty([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRequests();
  }, []);

  const req_column = [
    "Property ID",
    "Owner's Name",
    "Property Type",
    "Address",
    "Rooms/Units Count",
    "Listed Date",
  ];

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRowClick = (property) => {
    setSelectedRequest(property); // Set the selected property
    setShowViewModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowViewModal(false); // Close the modal
    setSelectedRequest(null); // Clear selected request
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredRequests = approvedProperty.filter((property) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const requestId = property._id ? property._id.toLowerCase() : "";
    const fullName = property.profile?.fullName
      ? property.profile.fullName.toLowerCase()
      : "";
    const createdAt = property.created_at
      ? format(new Date(property.created_at), "yyyy-MM-dd HH:mm").toLowerCase()
      : "";

    return (
      requestId.includes(lowerCaseQuery) ||
      fullName.includes(lowerCaseQuery) ||
      createdAt.includes(lowerCaseQuery)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <Table className="min-w-full  dark:border-zinc-600">
          <TableHeader>
            <TableRow className="border-b dark:border-zinc-600">
              {req_column.map((column) => (
                <TableHead
                  key={column}
                  className=" text-zinc-900 dark:text-gray-200 font-bold"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((property, index) => (
                <TableRow key={property._id} className={`cursor-pointer }`}>
                  <TableCell className="px-6 py-2 ">
                    <CopyableText
                      text={property._id}
                      onCopy={() => handleCopy(property._id)}
                    />
                  </TableCell>
                  <TableCell>{property.profile?.fullName}</TableCell>
                  <TableCell>{property.typeOfProperty}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.roomCount}</TableCell>
                  <TableCell>
                    {format(new Date(property.created_at), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center"
                >
                  No properties available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredRequests.length > 0 && totalPages >= 1 && (
        <Pagination className="mt-4 cursor-pointer">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationContent>
        </Pagination>
      )}

      {/* Modal for viewing selected property */}
      {showViewModal && selectedRequest && (
        <ViewPropertyModal
          selectedRequest={selectedRequest}
          closeModal={closeModal} // Pass function to close the modal
        />
      )}
    </div>
  );
}

export default Approved;
