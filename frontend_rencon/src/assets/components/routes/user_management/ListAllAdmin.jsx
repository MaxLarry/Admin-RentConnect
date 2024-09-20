import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../ui/CopyableText";
import { FaUserCircle } from "react-icons/fa";
import { SearchInput } from "@/components/ui/input";
import { DropdownMenuCheckboxes } from "./DropdowMenuCheckbox"; // Fixed typo in import name
import { Checkbox } from "@/components/ui/checkbox"; // Import Shadcn checkbox
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddAdminUser } from "./AddAdminUser";
import OptionEllipsis from "./OptionEllipsis";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ListAllAdmin() {
  const [listAdmin, setListAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 2;
  const admin_column = ["Name", "ID", "Role", "Last Active", "Date added", ""];

  const filteredAdmin = listAdmin.filter((admins) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const adminId = admins._id ? admins._id.toLowerCase() : "";
    const fullName = admins?.fullName ? admins.fullName.toLowerCase() : "";
    const createdAt = admins.created_at
      ? format(new Date(admins.created_at), "yyyy-MM-dd HH:mm").toLowerCase()
      : "";

    return (
      adminId.includes(lowerCaseQuery) ||
      fullName.includes(lowerCaseQuery) ||
      createdAt.includes(lowerCaseQuery)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdmin.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmin.length / itemsPerPage);

  const handleselectedAdmin = (id) => {
    setSelectedAdmin((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAdmin([]);
    } else {
      setSelectedAdmin(currentItems.map((admin) => admin._id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedAdmin.length !== currentItems.length) {
      setSelectAll(false);
    } else if (
      selectedAdmin.length === currentItems.length &&
      currentItems.length > 0
    ) {
      setSelectAll(true);
    }
  }, [selectedAdmin, currentItems]);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/user/admin");
        setListAdmin(response.data || []);
      } catch (error) {
        console.error("There was an error fetching the Admin List!", error);
        setError("Failed to fetch Admin List");
        setListAdmin([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
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
        <div className="relative ml-auto">
          <SearchInput
            type="text"
            placeholder="Search user..."
            className="rounded-md border focus:ring-teal-400 w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenuCheckboxes />
        <AddAdminUser />
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
              {admin_column.map((column, index) => (
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
              currentItems.map((admins) => (
                <TableRow
                  key={admins._id}
                  className="cursor-pointer"
                  data-state={
                    selectedAdmin.includes(admins._id) ? "selected" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedAdmin.includes(admins._id)}
                      onCheckedChange={() => handleselectedAdmin(admins._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar>
                        {admins?.profilePicture ? (
                          <AvatarImage
                            src={admins.profilePicture}
                            alt="admin_photo"
                          />
                        ) : (
                          <AvatarFallback>
                            <FaUserCircle  className="text-9xl"/>
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="p-2 flex flex-col">
                        <span>{admins?.fullName}</span>
                        <span>{admins?.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <CopyableText
                      text={admins._id}
                      onCopy={() => setCopiedId(admins._id)}
                    />
                  </TableCell>
                  <TableCell>{admins?.role}</TableCell>
                  <TableCell>
                    {admins.last_login
                      ? format(new Date(admins.last_login), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {admins.created_at
                      ? format(new Date(admins.created_at), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="w-10 pl-0 text-center">
                    <OptionEllipsis />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No admins available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredAdmin.length > 0 && totalPages > 0 && (
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

export default ListAllAdmin;
