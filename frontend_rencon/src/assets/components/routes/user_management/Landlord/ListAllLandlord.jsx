import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../../ui/CopyableText";
import { FaUserCircle } from "react-icons/fa";
import { SearchInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import ViewLandlordModal from "./ViewLandlord";
import EditLandlord from "./EditLandlord";

function ListAllLandlord() {
  const [listLandlord, setListLandlord] = useState([]);
  const [occupantCount, setOccupantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLandlord, setSelectedLandlord] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpenv1, setDialogOpenv1] = useState(false);
  const [landlordAction, setLandlordAction] = useState({
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

  const filteredLandlord = listLandlord
    .filter((landlords) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const landlordId = landlords._id ? landlords._id.toLowerCase() : "";
      const fullName = landlords?.fullName
        ? landlords.fullName.toLowerCase()
        : "";
      const createdAt = landlords.created_at
        ? format(
            new Date(landlords.created_at),
            "yyyy-MM-dd HH:mm"
          ).toLowerCase()
        : "";

      return (
        landlordId.includes(lowerCaseQuery) ||
        fullName.includes(lowerCaseQuery) ||
        createdAt.includes(lowerCaseQuery)
      );
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLandlord.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLandlord.length / itemsPerPage);

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

  const handleView = (landlord) => {
    setLandlordAction((prev) => ({ ...prev, toView: landlord })); // Set the selected landlord to view
  };

  const closeModal = () => {
    setLandlordAction({ toDelete: null, toView: null, toEdit: null }); // Clear selected request
  };

  const handleEdit = (landlord) => {
    setLandlordAction((prev) => ({ ...prev, toEdit: landlord })); // Set the selected landlord to edit
  };

  const handleDelete = (landlordId) => {
    setLandlordAction((prev) => ({ ...prev, toDelete: landlordId })); // Set landlord to delete
  };

  const handleConfirmDelete = async () => {
    const { toDelete } = landlordAction;
    if (!toDelete) return;

    try {
      const response = await axios.delete("/user/landlord-deletion", {
        data: { userId: toDelete },
      });

      toast({
        description: response.data.message,
        variant: "success",
      });

      setListLandlord((prevLandlords) =>
        prevLandlords.filter((landlord) => landlord._id !== toDelete)
      );

      closeModal(); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting landlord:", error);
      toast({
        description: error.message || "Failed to delete landlord.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelectedLandlord = async () => {
    if (selectedLandlord.length === 0) return;

    try {
      const response = await axios.delete("/user/selected-landlord-deletion", {
        data: { ids: selectedLandlord },
      });

      toast({
        description: response.data.message,
        variant: "success",
      });

      setListLandlord((prevLandlords) =>
        prevLandlords.filter(
          (landlord) => !selectedLandlord.includes(landlord._id)
        )
      );
      setSelectedLandlord([]);
      setSelectAll(false);
      setDialogOpenv1(false); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting selected Landlord:", error);
      toast({
        description: error.message || "Failed to delete selected Landlord.",
        variant: "destructive",
      });
    }
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

  useEffect(() => {
    const fetchLandlords = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/user/landlord");
        setListLandlord(response.data.length > 0 ? response.data : []);
      } catch (error) {
        console.error("There was an error fetching the Landlord List!", error);
        setError("Failed to fetch Landlord List");
        setListLandlord([]);
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
          <h1>Landlords</h1>
        </div>
        <div className="relative ml-auto">
          <SearchInput
            type="text"
            placeholder="Search landlords..."
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
                  onCheckedChange={handleSelectAll}
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
              currentItems.map((landlords) => (
                <TableRow key={landlords._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLandlord.includes(landlords._id)}
                      onCheckedChange={() =>
                        handleselectedLandlord(landlords._id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar>
                        {landlords?.profilePicture ? (
                          <AvatarImage
                            src={landlords.profilePicture}
                            alt="admin_photo"
                          />
                        ) : (
                          <AvatarFallback>
                            <FaUserCircle className="text-9xl" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="p-2 flex flex-col">
                        <span>{landlords?.fullName}</span>
                        <span>{landlords?.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <CopyableText
                      text={landlords._id}
                      onCopy={() => setCopiedId(landlords._id)}
                    />
                  </TableCell>
                  <TableCell>
                    {landlords?.status ? landlords.status : "N/A"}
                  </TableCell>
                  <TableCell>
                    {landlords?.last_login
                      ? format(
                          new Date(landlords.last_login),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {landlords?.created_at
                      ? format(
                          new Date(landlords.created_at),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <OptionEllipsis
                      onEdit={() => handleEdit(landlords)}
                      onView={() => handleView(landlords)}
                      onDelete={() => handleDelete(landlords._id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={landlord_column.length + 1}
                  className="text-center"
                >
                  No Landlords Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredLandlord.length > 0 && totalPages > 0 && (
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
      {selectedLandlord.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="fixed bottom-5 max-w-fit border rounded-lg text-sm shadow-md border-zinc-700 bg-zinc-800 text-white p-4 flex justify-between gap-10 items-center transition-transform transform translate-y-0 animate-slide-up">
            <div className="flex gap-3">
              <div className="text-gray-200 bg-teal-400 px-2 rounded-md">
                {selectedLandlord.length}
              </div>
              <p>Landlord(s) Selected</p>
            </div>
            <div>
              <button
                className="px-4 py-2 mr-2 rounded- text-white hover:text-gray-400"
                onClick={() => setSelectedLandlord([])}
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
                      Are you sure you want to delete the selected Landlord(s)?
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
                      onClick={handleDeleteSelectedLandlord} // Call the delete function
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
      {landlordAction.toView && (
        <ViewLandlordModal
          landlordToView={landlordAction.toView}
          title={`User ID - ${landlordAction.toView?._id}`}
          closeModal={closeModal}
        />
      )}

      {/* Modal for Editing Landlord */}
      {landlordAction.toEdit && (
        <EditLandlord
          landlordToEdit={landlordAction.toEdit}
          title={`User ID - ${landlordAction.toEdit?._id}`}
          closeModal={closeModal}
        />
      )}

      {/* Confirmation Dialog for Deleting Landlord */}
      <Dialog
        open={Boolean(landlordAction.toDelete)}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this landlord? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  );
}

export default ListAllLandlord;
