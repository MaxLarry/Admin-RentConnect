import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../../ui/CopyableText";
import { FaUserCircle } from "react-icons/fa";
import { SearchInput } from "@/components/ui/input";
import { DropdownMenuCheckboxes } from "./DropdowMenuCheckbox"; // Fixed typo in import name
import { Checkbox } from "@/components/ui/checkbox"; // Import Shadcn checkbox
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddAdminUser } from "./AddAdminUser";
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
import ViewAdminModal from "./ViewAdmin";
import EditAdmin from "./EditAdmin";

function ListAllAdmin() {
  const [listAdmin, setListAdmin] = useState([]); // set all the admins list
  const [adminCount, setAdminCount] = useState(0); //store the count of admin response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpenv1, setDialogOpenv1] = useState(false); // State for dialog
  const [adminAction, setAdminAction] = useState({
    toDelete: null,
    toView: null,
    toEdit: null,
  });
  const { toast } = useToast();
  const itemsPerPage = 20;
  const admin_column = ["Name", "ID", "Role", "Last Login", "Date added", ""];

  const filteredAdmin = listAdmin
    .filter((admins) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const adminId = admins._id ? admins._id.toLowerCase() : "";
      const fullName = admins?.fullName ? admins.fullName.toLowerCase() : "";
      const createdAt = admins.created_at
        ? format(new Date(admins.created_at), "yyyy-MM-dd HH:mm").toLowerCase()
        : "";

      const roleMatches =
        selectedRoles.length === 0 || selectedRoles.includes(admins.role);

      return (
        (adminId.includes(lowerCaseQuery) ||
          fullName.includes(lowerCaseQuery) ||
          createdAt.includes(lowerCaseQuery)) &&
        roleMatches
      );
    })
    .sort((a, b) => {
      // Sort by created_at in descending order (new to old)
      return new Date(b.created_at) - new Date(a.created_at);
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

  // Handle role selection change
  const handleRoleChange = (role) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(role)
        ? prevSelected.filter((r) => r !== role)
        : [...prevSelected, role]
    );
  };

  // const handleView = (admin) => {
  //   // Handle viewing the admin
  //   console.log("Viewing admin", admin);
  // };

  // const handleEdit = (admin) => {
  //   // Handle editing the admin
  //   console.log("Editing admin", admin);
  // };

  // // Handle deleting the admin
  // const handleDelete = (adminId) => {
  //   setAdminToDelete(adminId); // Set admin to delete
  //   setDialogOpen(true); // Open confirmation dialog
  // };

  const handleView = (admin) => {
    setAdminAction((prev) => ({ ...prev, toView: admin })); // Set the selected admin to view
  };

  const closeModal = () => {
    setAdminAction({ toDelete: null, toView: null, toEdit: null }); // Clear selected request
  };

  const handleEdit = (admin) => {
    setAdminAction((prev) => ({ ...prev, toEdit: admin })); // Set the selected admin to edit
  };

  const handleDelete = (adminId) => {
    setAdminAction((prev) => ({ ...prev, toDelete: adminId })); // Set admin to delete
  };

  const handleConfirmDelete = async () => {
    const { toDelete } = adminAction;
    if (!toDelete) return;

    try {
      const response = await axios.delete("/user/admin-deletion", {
        data: { userId: toDelete },
      });

      toast({
        description: response.data.message,
        variant: "success",
      });

      setListAdmin((prevAdmin) =>
        prevAdmin.filter((admin) => admin._id !== toDelete)
      );

      closeModal(); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast({
        description: error.message || "Failed to delete admin.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelectedAdmin = async () => {
    if (selectedAdmin.length === 0) return;

    try {
      const response = await axios.delete("/user/selected-admin-deletion", {
        data: { ids: selectedAdmin },
      });

      toast({
        description: response.data.message,
        variant: "success",
      });

      setListAdmin((prevAdmin) =>
        prevAdmin.filter((admin) => !selectedAdmin.includes(admin._id))
      );
      setSelectedAdmin([]);
      setSelectAll(false);
      setDialogOpenv1(false); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting selected admin:", error);
      toast({
        description: error.message || "Failed to delete selected admin.",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = (adminId) => {
    // Handle suspending the admin
    console.log("Suspending admin", adminId);
    // You can make an API request to suspend the admin here
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
        if (response.data.admins && response.data.admins.length > 0) {
          setListAdmin(response.data.admins);
        } else {
          setListAdmin([]);
        }
        setAdminCount(response.data.count);
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
        <div className="flex space-x-2 text-xl font-bold justify-center items-center">
          <h1>Admin</h1>
          <h2>{adminCount}</h2>
        </div>
        <div className="relative ml-auto">
          <SearchInput
            type="text"
            placeholder="Search user..."
            className="rounded-md border focus:ring-teal-400 w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenuCheckboxes
          selectedRoles={selectedRoles}
          onRoleChange={handleRoleChange}
        />
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
                            <FaUserCircle className="text-9xl" />
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
                      ? format(
                          new Date(admins.last_login),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {admins.created_at
                      ? format(new Date(admins.created_at), "MMMM dd, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="w-10 pl-0 text-center">
                    <OptionEllipsis
                      onView={() => handleView(admins)}
                      onEdit={() => handleEdit(admins)}
                      onDelete={() => handleDelete(admins._id)}
                      onSuspend={() => handleSuspend(admins._id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
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

      {/* Dialog for select delete confirmation */}
      {selectedAdmin.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="fixed bottom-5 max-w-fit border rounded-lg text-sm shadow-md border-zinc-700 bg-zinc-800 text-white p-4 flex justify-between gap-10 items-center transition-transform transform translate-y-0 animate-slide-up">
            <div className="flex gap-3">
              <div className="text-gray-200 bg-teal-400 px-2 rounded-md">
                {selectedAdmin.length}
              </div>
              <p>Admin(s) Selected</p>
            </div>
            <div>
              <button
                className="px-4 py-2 mr-2 rounded- text-white hover:text-gray-400"
                onClick={() => setSelectedAdmin([])}
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
                      Are you sure you want to delete the selected admin(s)?
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
                      onClick={handleDeleteSelectedAdmin} // Call the delete function
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
      {adminAction.toView && (
        <ViewAdminModal
          adminToView={adminAction.toView}
          title={`User ID - ${adminAction.toView?._id}`}
          closeModal={closeModal}
        />
      )}

      {/* Modal for Editing Landlord */}
      {adminAction.toEdit && (
        <EditAdmin
          adminToEdit={adminAction.toEdit}
          title={`User ID - ${adminAction.toEdit?._id}`}
          closeModal={closeModal}
        />
      )}

      {/* Dialog for delete confirmation */}
      <Dialog
        open={Boolean(adminAction.toDelete)}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin? This action cannot be
              undone.
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

export default ListAllAdmin;
