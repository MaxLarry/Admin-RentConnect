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

function ListAllOccupant() {
  const [listOccupant, setListOccupant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOccupant, setSelectedOccupant] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 20;
  const landlord_column = ["Name", "ID", "Status", "Last Active", "Date Register", ""];

  const filteredOccupant = listOccupant
  .filter((occupants) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const occupantId = occupants._id ? occupants._id.toLowerCase() : "";
    const fullName = occupants?.fullName ? occupants.fullName.toLowerCase() : "";
    const createdAt = occupants.created_at
      ? format(new Date(occupants.created_at), "yyyy-MM-dd HH:mm").toLowerCase()
      : "";

    return (
      occupantId.includes(lowerCaseQuery) ||
      fullName.includes(lowerCaseQuery) ||
      createdAt.includes(lowerCaseQuery)
    );
  })
    .sort((a, b) => {
    // Sort by created_at in descending order (new to old)
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOccupant.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOccupant.length / itemsPerPage);

  const handleselectedOccupant = (id) => {
    setSelectedOccupant((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOccupant([]);
    } else {
      setSelectedOccupant(currentItems.map((admin) => admin._id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedOccupant.length !== currentItems.length) {
      setSelectAll(false);
    } else if (
      selectedOccupant.length === currentItems.length &&
      currentItems.length > 0
    ) {
      setSelectAll(true);
    }
  }, [selectedOccupant, currentItems]);


  //api fetch all Occupants
  useEffect(() => {
    const fetchoccupants = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/user/occupant");
        setListOccupant(response.data || []);
      } catch (error) {
        console.error("There was an error fetching the Occupants List!", error);
        setError("Failed to fetch Occupants List");
        setListOccupant([]);
      } finally {
        setLoading(false);
      }
    };

    fetchoccupants();
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
          <h1>Occupants</h1>
        <h2></h2>
        </div>
        <div className="relative ml-auto">
          <SearchInput
            type="text"
            placeholder="Search occupants..."
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
              currentItems.map((occupants) => (
                <TableRow
                  key={occupants._id}
                  className="cursor-pointer"
                  data-state={
                    selectedOccupant.includes(occupants._id) ? "selected" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedOccupant.includes(occupants._id)}
                      onCheckedChange={() => handleselectedOccupant(occupants._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar>
                        {occupants?.profilePicture ? (
                          <AvatarImage
                            src={occupants.profilePicture}
                            alt="admin_photo"
                          />
                        ) : (
                          <AvatarFallback>
                            <FaUserCircle  className="text-9xl"/>
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="p-2 flex flex-col">
                        <span>{occupants?.fullName}</span>
                        <span>{occupants?.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <CopyableText
                      text={occupants._id}
                      onCopy={() => setCopiedId(occupants._id)}
                    />
                  </TableCell>
                  <TableCell>{occupants?.Status}</TableCell>
                  <TableCell>
                    {occupants.last_login
                      ? format(new Date(occupants.last_login), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {occupants.created_at
                      ? format(new Date(occupants.created_at), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="w-10 pl-0 text-center">
                    <OptionEllipsis />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No occupants available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredOccupant.length > 0 && totalPages > 0 && (
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

export default ListAllOccupant;
