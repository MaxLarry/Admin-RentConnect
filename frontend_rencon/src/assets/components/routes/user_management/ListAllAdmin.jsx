import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../ui/CopyableText";
import { SearchInput } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
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

function ListAllAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  const itemsPerPage = 20;

  const req_column = [
    "ID",
    "Requester Name",
    "Property Type",
    "Status",
    "Request Date",
    "Action",
  ];

  /*useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true); // Start loading

      try {
        const response = await axios.get("/requests/pending-requests");

        if (response.data && response.data.length > 0) {
          setPendingRequests(response.data);
        } else {
          setPendingRequests([]); // No data available
        }
      } catch (error) {
        console.error(
          "There was an error fetching the pending requests!",
          error
        );
        setError("Failed to fetch pending requests");
        setPendingRequests([]); // Set to empty array in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPendingRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }*/


  return (
<>
  <div className="flex flex-wrap items-center gap-4 pb-5">
    <div className="relative ml-auto">
      <SearchInput
        type="text"
        placeholder="Search user..."
        className="rounded-md border focus:ring-teal-400 w-auto"
      />
    </div>
  </div>
  <div className="flex justify-center overflow-x-auto">
    <Table className="min-w-full dark:border-zinc-600">

    </Table>
  </div>
</>

  );
}

export default ListAllAdmin;
