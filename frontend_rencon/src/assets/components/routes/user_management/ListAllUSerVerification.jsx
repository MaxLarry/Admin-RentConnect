import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../ui/CopyableText";
import { FaUserCircle } from "react-icons/fa";
import { SearchInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Import Shadcn checkbox
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OptionEllipsis from "./OptionEllipsis";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ListAllUSerVerification() {
  const [listUserRequest, setListUserRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLandlord, setSelectedLandlord] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 20;
  const landlord_column = [
    "Name",
    "ID",
    "Date Register",
    "Date Request",
    "Action",
  ];

  const filteredRequest = listUserRequest
    .filter((request) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const UserId = request._id ? request._id.toLowerCase() : "";
      const fullName = request?.fullName ? request.fullName.toLowerCase() : "";

      return (
        UserId.includes(lowerCaseQuery) || fullName.includes(lowerCaseQuery)
      );
    })
    .sort((a, b) => {
      // Sort by created_at in descending order (new to old)
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequest.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequest.length / itemsPerPage);

  const handleselectedLandlord = (id) => {
    setSelectedLandlord((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLandlord([]);
    } else {
      setSelectedLandlord(currentItems.map((admin) => admin._id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedLandlord.length !== currentItems.length) {
      setSelectAll(false);
    } else if (
      selectedLandlord.length === currentItems.length &&
      currentItems.length > 0
    ) {
      setSelectAll(true);
    }
  }, [selectedLandlord, currentItems]);

  //api fetch all Landlord
  useEffect(() => {
    const fetchLandlords = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/user/user-request");
        setListUserRequest(response.data || []);
      } catch (error) {
        console.error("There was an error fetching the Landlord List!", error);
        setError("Failed to fetch Landlord List");
        setListUserRequest([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 pb-5">
        <div className="flex space-x-2 text-xl font-bold justify-center items-center">
          <h1>User Request Verification</h1>
          <h2></h2>
        </div>
        <div className="relative ml-auto">
          <SearchInput
            type="text"
            placeholder="Search request..."
            className="rounded-md border focus:ring-teal-400 w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-center overflow-x-auto">
        <Table className="min-w-full dark:border-zinc-600">
          <TableHeader>
            <TableRow className="border-b dark:border-zinc-600">
              <TableHead>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll} // Handle select all change
                />
              </TableHead>
              {landlord_column.map((column, index) => (
                <TableHead
                  key={index}
                  className="text-zinc-900 dark:text-gray-200 font-bold"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((request) => (
                <TableRow
                  key={request._id}
                  className="cursor-pointer"
                  data-state={
                    selectedLandlord.includes(request._id) ? "selected" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedLandlord.includes(request._id)}
                      onCheckedChange={() =>
                        handleselectedLandlord(request._id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar>
                        {request?.profilePicture ? (
                          <AvatarImage
                            src={request.profilePicture}
                            alt="admin_photo"
                          />
                        ) : (
                          <AvatarFallback>
                            <FaUserCircle className="text-9xl" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="p-2 flex flex-col">
                        <span>{request?.fullName}</span>
                        <span>{request?.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <CopyableText
                      text={request._id}    
                      onCopy={() => setCopiedId(request._id)}
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    {request.registeredDate
                      ? format(new Date(request.registeredDate), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {request.last_login
                      ? format(new Date(request.last_login), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => handleReview(request)}
                      className="cursor-pointer text-teal-400 hover:underline dark:text-teal-500"
                    >
                      Review
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No request available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredRequest.length > 0 && totalPages > 0 && (
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="text-xs"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="text-xs"
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}

export default ListAllUSerVerification;
