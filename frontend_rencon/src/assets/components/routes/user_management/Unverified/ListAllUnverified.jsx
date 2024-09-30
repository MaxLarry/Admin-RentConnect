import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../../ui/CopyableText";
import { SearchInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import OptionDelete from "./OptionDelete";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ListAllUnverified() {
  const [listUnverified, setListUnverified] = useState([]);
  const [unverifiedCount, setUnverifiedCount] = useState(0); //store the count of occupant response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnverified, setSelectedUnverified] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpenv1, setDialogOpenv1] =useState(false);
  const [dialogOpen, setDialogOpen] =useState(false);
  const [unverifiedToDelete, setUnverifiedToDelete]= useState(null)

  const { toast } = useToast();
  const itemsPerPage = 20;
  const unverified_column = [
    "ID",
    "Email",
    "Created Date",
    "Last Login",
    "",
  ];

  const filteredUnverified = listUnverified
    .filter((unverified) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const unverifiedId = unverified._id ? unverified._id.toLowerCase() : "";
      const createdAt = unverified.created_at
        ? format(
            new Date(unverified.created_at),
            "yyyy-MM-dd HH:mm"
          ).toLowerCase()
        : "";

      return (
        unverifiedId.includes(lowerCaseQuery) ||
        createdAt.includes(lowerCaseQuery)
      );
    })
    .sort((a, b) => {
      // Sort by created_at in descending order (new to old)
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUnverified.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredUnverified.length / itemsPerPage);

  const handleselectedOccupant = (id) => {
    setSelectedUnverified((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUnverified([]);
    } else {
      setSelectedUnverified(currentItems.map((user) => user._id));
    }
    setSelectAll(!selectAll);
  };

  const handleConfirmDelete = async () => {
    if (!unverifiedToDelete) return;

    try {
      const response = await axios.delete("/user/unverified-deletion", {
        data: { userId: unverifiedToDelete },
      });

      toast({
        description: response.data.message,
        variant: "success",
      });

      setListUnverified((prevList) =>
        prevList.filter((user) => user._id !== unverifiedToDelete)
      );

      closeModal(); // Close dialog after deletion
      setUnverifiedToDelete(null); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

    // Handle deleting the admin
  const handleDelete = (userId) => {
    setUnverifiedToDelete(userId); // Set admin to delete
    setDialogOpen(true); // Open confirmation dialog
  };

  const closeModal = () => {
    setDialogOpen(false);
    setDialogOpenv1(false);
  };
  

  const handleDeleteSelectedUnverified = async () => {
    if (selectedUnverified.length === 0) return;

    try {
      const response = await axios.delete("/user/selected-unverified-deletion", {
        data: { ids: selectedUnverified },
      });

      toast({
        description: response.data.message,
        variant: "success",
      });

      setListUnverified((prevList) =>
        prevList.filter((user) => !selectedUnverified.includes(user._id))
      );
      setSelectedUnverified([]);
      setSelectAll(false);
      setDialogOpenv1(false); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting selected user:", error);
      toast({
        description: error.message || "Failed to delete selected user.",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    if (selectedUnverified.length !== currentItems.length) {
      setSelectAll(false);
    } else if (
      selectedUnverified.length === currentItems.length &&
      currentItems.length > 0
    ) {
      setSelectAll(true);
    }
  }, [selectedUnverified, currentItems]);

  useEffect(() => {
    const fetchUnverified = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/user/unverified-user");
        if (response.data.unverified && response.data.unverified?.length > 0) {
          setListUnverified(response.data.unverified);
        } else {
          setListUnverified([]);
        }
        setUnverifiedCount(response.data.count);
      } catch (error) {
        console.error("There was an error fetching the Unverified List!", error);
        setError("Failed to fetch Unverified List");
        setListUnverified([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnverified();
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
          <h1>Unverified User</h1>
          <h2>{unverifiedCount}</h2>
        </div>
        <div className="relative ml-auto">
          <SearchInput
            type="text"
            placeholder="Search unverified..."
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
              {unverified_column.map((column, index) => (
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
              currentItems.map((unverified) => (
                <TableRow
                  key={unverified._id}
                  className="cursor-pointer"
                  data-state={
                    selectedUnverified.includes(unverified._id) ? "selected" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUnverified.includes(unverified._id)}
                      onCheckedChange={() =>
                        handleselectedOccupant(unverified._id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <CopyableText
                      text={unverified._id}
                      onCopy={() => setCopiedId(unverified._id)}
                    />
                  </TableCell>
                  <TableCell>{unverified?.email}</TableCell>
                  <TableCell>
                    {unverified.created_at
                      ? format(
                          new Date(unverified.created_at),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {unverified.last_login
                      ? format(
                          new Date(unverified.last_login),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="w-10 pl-0 text-center">
                    <OptionDelete unverifiedToDelete= {() => handleDelete(unverified._id)}/>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No unverified available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredUnverified.length > 0 && totalPages > 0 && (
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

      {/* Dialog for select delete confirmation */}
      {selectedUnverified.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="fixed bottom-5 max-w-fit border rounded-lg text-sm shadow-md border-zinc-700 bg-zinc-800 text-white p-4 flex justify-between gap-10 items-center transition-transform transform translate-y-0 animate-slide-up">
            <div className="flex gap-3">
              <div className="text-gray-200 bg-teal-400 px-2 rounded-md">
                {selectedUnverified.length}
              </div>
              <p>Occupant(s) Selected</p>
            </div>
            <div>
              <button
                className="px-4 py-2 mr-2 rounded- text-white hover:text-gray-400"
                onClick={() => setSelectedUnverified([])}
              >
                Cancel
              </button>
              <Dialog open={dialogOpenv1} onOpenChange={setDialogOpenv1}>
                <DialogTrigger asChild>
                  <button
                    className="px-4 py-2 rounded-md border border-gray-500 hover:border-white"
                    onClick={() => setDialogOpenv1(true)}
                  >
                    Delete
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the selected rejected
                      Occupant(s)?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 mr-2 rounded-md text-gray-600"
                      onClick={() => setDialogOpenv1(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-md bg-red-500 text-white"
                      onClick={handleDeleteSelectedUnverified} // Call the delete function
                    >
                      Confirm
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}

      {/* Dialog for delete confirmation */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this occupant(s)?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="destructive">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}

export default ListAllUnverified;
