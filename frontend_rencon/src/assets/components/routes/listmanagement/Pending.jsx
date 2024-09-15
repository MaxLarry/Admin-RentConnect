import React, { useState } from "react";
import { IoCopy } from "react-icons/io5";
import Pagination from "../../ui/Pagination";
import CopyableText from "../../ui/CopyableText";

function Pending({ searchQuery }) {
  const listingRequests = [
    {
      id: "12345678901234567890",
      name: "Alice Johnson",
      status: "",
      date: "2024-09-05",
    },
    {
      id: "09876543210987oio654321",
      name: "Bob Smith",
      status: "",
      date: "2024-09-04",
    },
    {
      id: "0987d6543210987654321",
      name: "Fred Murphy",
      status: "",
      date: "2024-09-05",
    },
    {
      id: "0987ds6543210987654321",
      name: "Gina Bell",
      status: "",
      date: "2024-09-04",
    },
    {
      id: "09876w543210987654321",
      name: "Henry Collins",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "098765j43210987654321",
      name: "Isabella Cooper",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "098765r43210987654321",
      name: "Jacob Foster",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "09876543210987k654321",
      name: "Katherine Turner",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "09876543210f987654321",
      name: "Leo Parker",
      status: "",
      date: "2024-09-05",
    },
    {
      id: "0987654x3210987654321",
      name: "Megan Brooks",
      status: "",
      date: "2024-09-04",
    },
    {
      id: "0987654321v0987654321",
      name: "Nathan Wood",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "0987654cv3210987654321",
      name: "Olivia Reed",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "09876543210987654321",
      name: "Patrick Bell",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "0vc9876543210987654321",
      name: "Quincy Ward",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "098765432109876vc54321",
      name: "Ruby Brooks",
      status: "",
      date: "2024-09-05",
    },
    {
      id: "09876vc543210987654321",
      name: "Samuel Cook",
      status: "",
      date: "2024-09-04",
    },
    {
      id: "098vc76543210987654321",
      name: "Tessa Rogers",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "098765432109dh87654321",
      name: "Ulysses Campbell",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "09876543210h987654321",
      name: "Vivian Powell",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "09876543210d987654321",
      name: "Walter Edwards",
      status: "",
      date: "2024-09-03",
    },
    {
      id: "09876543210o987654321",
      name: "Xenia Simmons",
      status: "",
      date: "2024-09-05",
    },
    {
      id: "09876543210u987654321",
      name: "Yvonne Jenkins",
      status: "",
      date: "2024-09-04",
    },
  ];
  const req_column = [
    "ID",
    "Requester Name",
    "Status",
    "Requested Date",
    "Action",
  ];

  const handleReview = (id) => {
    console.log(`Review request with ID: ${id}`);
  };

  const handleApprove = (id) => {
    console.log(`Approve request with ID: ${id}`);
  };

  const handleDecline = (id) => {
    console.log(`Decline request with ID: ${id}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 3000);
    });
  };

  const filteredRequests = listingRequests.filter((request) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      request.id.toLowerCase().includes(lowerCaseQuery) ||
      request.name.toLowerCase().includes(lowerCaseQuery) ||
      request.status.toLowerCase().includes(lowerCaseQuery) ||
      request.date.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-center text-sm">
          <thead>
            <tr className="border-b dark:border-zinc-600">
              {req_column.map((column) => (
                <th
                  key={column}
                  className="px-6 py-2 text-gray-600 dark:text-gray-200 font-bold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((request, index) => (
                <tr
                  key={request.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-zinc-700"
                      : "bg-white dark:bg-zinc-800"
                  }`}
                >
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200 relative">
                    <CopyableText text={request.id} />
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {request.name}
                  </td>
                  <td
                    className={`px-6 py-2 font-medium ${
                      request.status === "Approved"
                        ? "text-green-500 dark:text-green-400"
                        : request.status === "Rejected"
                        ? "text-red-500 dark:text-red-400"
                        : "text-yellow-500 dark:text-yellow-400"
                    }`}
                  >
                    {request.status}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {request.date}
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex justify-center space-x-2">
                      <span
                        onClick={() => handleReview(request.id)}
                        className="cursor-pointer text-blue-500 hover:underline dark:text-blue-400"
                      >
                        Review
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        |
                      </span>
                      <span
                        onClick={() => handleApprove(request.id)}
                        className="cursor-pointer text-green-500 hover:underline dark:text-green-400"
                      >
                        Approve
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        |
                      </span>
                      <span
                        onClick={() => handleDecline(request.id)}
                        className="cursor-pointer text-red-500 hover:underline dark:text-red-400"
                      >
                        Decline
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 dark:text-gray-200">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredRequests.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Pending;
