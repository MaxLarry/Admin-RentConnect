import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../../ui/CopyableText";
import { FaUserCircle } from "react-icons/fa";
import { SearchInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Import Shadcn checkbox
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OptionEllipsis from "../OptionEllipsis";
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
import ViewOccupantModal from "./ViewOccupant";
import EditOccupant from "./EditOccupant";

function ListAllOccupant() {
  const [listOccupant, setListOccupant] = useState([]);
  const [occupantCount, setOccupantCount] = useState(0); //store the count of occupant response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOccupant, setSelectedOccupant] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpenv1, setDialogOpenv1] =useState(false);
  const [occupantAction, setOccupantAction] = useState({
    toDelete: null,
    toView: null,
    toEdit: null,
  });

  const { toast } = useToast();
  const itemsPerPage = 20;
  const landlord_column = [
    "Name",
    "ID",
    "Status",
    "Last Active",
    "Date Register",
    "",
  ];

  const filteredOccupant = listOccupant
    .filter((occupants) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const occupantId = occupants._id ? occupants._id.toLowerCase() : "";
      const fullName = occupants?.fullName
        ? occupants.fullName.toLowerCase()
        : "";
      const createdAt = occupants.created_at
        ? format(
            new Date(occupants.created_at),
            "yyyy-MM-dd HH:mm"
          ).toLowerCase()
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
  const currentItems = filteredOccupant.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
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

  // const handleView = (occupant) => {
  //   // Handle viewing the occupant
  //   console.log("Viewing occupant", occupant);
  // };

  // const handleEdit = (occupant) => {
  //   // Handle editing the occupant
  //   console.log("Editing occupant", occupant);
  // };

  // // Handle deleting the occupant
  // const handleDelete = (occupantId) => {
  //   setOccupantToDelete(occupantId); // Set occupant to delete
  //   setDialogOpen(true); // Open confirmation dialog
  // };

  const handleView = (occupant) => {
    setOccupantAction((prev) => ({ ...prev, toView: occupant })); // Set the selected occupant to view
  };

  const closeModal = () => {
    setOccupantAction({ toDelete: null, toView: null, toEdit: null }); // Clear selected request
  };

  const handleEdit = (occupant) => {
    setOccupantAction((prev) => ({ ...prev, toEdit: occupant })); // Set the selected occupant to edit
  };

  const handleDelete = (occupantId) => {
    setOccupantAction((prev) => ({ ...prev, toDelete: occupantId })); // Set occupant to delete
  };

  const handleConfirmDelete = async () => {
    const { toDelete } = occupantAction;
    if (!toDelete) return;

    try {
      // Send a DELETE request with the selected occupant ID
      const response = await axios.delete("/user/occupant-deletion", {
        data: { userId: toDelete },
      });

      // Show success toast with message from backend
      toast({
        description: response.data.message, // message from backend
        variant: "success", // Use a success variant
      });

      // Update the state to remove the deleted occupant
      setListOccupant((prevOccupants) =>
        prevOccupants.filter((occupant) => occupant._id !== toDelete)
      );

      closeModal(); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting occupant:", error);
      toast({
        description: error.message || "Failed to delete occupant.",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = (occupantId) => {
    // Handle suspending the occupant
    console.log("Suspending occupant", occupantId);
    // You can make an API request to suspend the occupant here
  };

  //handle bulk or selected occupant usergf
  const handleDeleteSelectedOccupant = async () => {
    if (selectedOccupant.length === 0) return;

    try {
      // Send a DELETE request with the selected property IDs
      const response = await axios.delete("/user/selected-occupant-deletion", {
        data: { ids: selectedOccupant },
      });

      // Show success toast with message from backend
      toast({
        description: response.data.message, // message from backend
        variant: "success", // Use a success variant
      });

      // Update the state to remove the deleted requests
      setListOccupant((prevOccupants) =>
        prevOccupants.filter(
          (occupant) => !selectedOccupant.includes(occupant._id)
        )
      );
      setSelectedOccupant([]);
      setSelectAll(false);
      setDialogOpenv1(false); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting selected Occupant:", error);
      toast({
        description: error.message || "Failed to delete selected Occupant.", // Use the extracted error message
        variant: "destructive",
      });
    }
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
        if (response.data && response.data.length > 0) {
          setListOccupant(response.data);
        } else {
          setListOccupant([]);
        }
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
                      onCheckedChange={() =>
                        handleselectedOccupant(occupants._id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar>
                        {occupants?.profilePicture ? (
                          <AvatarImage
                            src={occupants.profilePicture}
                            alt="user_photo"
                          />
                        ) : (
                          <AvatarFallback>
                            <FaUserCircle className="text-9xl" />
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
                      ? format(
                          new Date(occupants.last_login),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {occupants.created_at
                      ? format(
                          new Date(occupants.created_at),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="w-10 pl-0 text-center">
                    <OptionEllipsis
                      onView={() => handleView(occupants)}
                      onEdit={() => handleEdit(occupants)}
                      onDelete={() => handleDelete(occupants._id)}
                      onSuspend={() => handleSuspend(occupants._id)}
                    />
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

      {/* Dialog for select delete confirmation */}
      {selectedOccupant.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="fixed bottom-5 max-w-fit border rounded-lg text-sm shadow-md border-zinc-700 bg-zinc-800 text-white p-4 flex justify-between gap-10 items-center transition-transform transform translate-y-0 animate-slide-up">
            <div className="flex gap-3">
              <div className="text-gray-200 bg-teal-400 px-2 rounded-md">
                {selectedOccupant.length}
              </div>
              <p>Occupant(s) Selected</p>
            </div>
            <div>
              <button
                className="px-4 py-2 mr-2 rounded- text-white hover:text-gray-400"
                onClick={() => setSelectedOccupant([])}
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
                      onClick={handleDeleteSelectedOccupant} // Call the delete function
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

      {/* Modal for Viewing Landlord */}
      {occupantAction.toView && (
        <ViewOccupantModal
          occupantToView={occupantAction.toView}
          title={`User ID - ${occupantAction.toView?._id}`}
          closeModal={closeModal}
        />
      )}

      {/* Modal for Editing Landlord */}
      {occupantAction.toEdit && (
        <EditOccupant
          occupantToEdit={occupantAction.toEdit}
          title={`User ID - ${occupantAction.toEdit?._id}`}
          closeModal={closeModal}
        />
      )}

      {/* Dialog for delete confirmation */}
      <Dialog
        open={Boolean(occupantAction.toDelete)}
        onOpenChange={(open) => !open && closeModal()}
      >
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

export default ListAllOccupant;
