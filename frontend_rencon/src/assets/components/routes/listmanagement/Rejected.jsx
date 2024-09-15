import React, { useState, useEffect } from "react";
import CopyableText from "../../ui/CopyableText";
import Pagination from "../../ui/Pagination";

function Rejected({ searchQuery }) {
  const listingRejected = [
    {
      id: "12345678901234567890",
      name: "Alice Johnson",
      date: "2024-09-05",
      rejected_date: "2024-09-06",
      note: "meow meow meow",
    },
    {
      id: "09876543210987oio654321",
      name: "Bob Smith",
      date: "2024-09-04",
      rejected_date: "2024-09-05",
      note: "meow meow meow",
    },
    {
      id: "0987d6543210987654321",
      name: "Fred Murphy",
      date: "2024-09-05",
      rejected_date: "2024-09-06",
      note: "meow meow meow",
    },
    {
      id: "0987ds6543210987654321",
      name: "Gina Bell",
      date: "2024-09-04",
      rejected_date: "2024-09-05",
      note: "meow meow meow",
    },
    {
      id: "09876w543210987654321",
      name: "Henry Collins",
      date: "2024-09-03",
      rejected_date: "2024-09-03",
      note: "meow meow meow",
    },
    {
      id: "098765j43210987654321",
      name: "Isabella Cooper",
      date: "2024-09-03",
      rejected_date: "2024-09-03",
      note: "meow meow meow",
    },
    {
      id: "098765r43210987654321",
      name: "Jacob Foster",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "09876543210987k654321",
      name: "Katherine Turner",
      date: "2024-09-03",
      rejected_date: "2024-09-03",
      note: "meow meow meow",
    },
    {
      id: "09876543210f987654321",
      name: "Leo Parker",
      date: "2024-09-05",
      rejected_date: "2024-09-06",
      note: "meow meow meow",
    },
    {
      id: "0987654x3210987654321",
      name: "Megan Brooks",
      date: "2024-09-04",
      rejected_date: "2024-09-05",
      note: "meow meow meow",
    },
    {
      id: "0987654321v0987654321",
      name: "Nathan Wood",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "0987654cv3210987654321",
      name: "Olivia reed",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "09876543210987654321",
      name: "Patrick Bell",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "0vc9876543210987654321",
      name: "Quincy Ward",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "098765432109876vc54321",
      name: "Ruby Brooks",
      date: "2024-09-05",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "09876vc543210987654321",
      name: "Samuel Cook",
      date: "2024-09-04",
      rejected_date: "2024-09-06",
      note: "meow meow meow",
    },
    {
      id: "098vc76543210987654321",
      name: "Tessa Rogers",
      date: "2024-09-03",
      rejected_date: "2024-09-05",
      note: "meow meow meow",
    },
    {
      id: "098765432109dh87654321",
      name: "Ulysses Campbell",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "09876543210h987654321",
      name: "Vivian Powell",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "09876543210d987654321",
      name: "Walter Edwards",
      date: "2024-09-03",
      rejected_date: "2024-09-04",
      note: "meow meow meow",
    },
    {
      id: "09876543210o987654321",
      name: "Xenia Simmons",
      date: "2024-09-05",
      rejected_date: "2024-09-06",
      note: "meow meow meow",
    },
    {
      id: "09876543210u987654321",
      name: "Yvonne Jenkins",
      date: "2024-09-04",
      rejected_date: "2024-09-05",
      note: "meow meow meow",
    },
  ];

  const req_column = ["Select", "ID", "Requester Name", "Requested Date", "Rejected Date", "Note"];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]); // List of selected requests
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 20;

  const filteredRequests = listingRejected.filter((request) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      request.id.toLowerCase().includes(lowerCaseQuery) ||
      request.name.toLowerCase().includes(lowerCaseQuery) ||
      request.date.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  // Handle select/unselect individual requests
  const handleSelectRejRequest = (id) => {
    setSelectedRequests(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id) // Unselect
          : [...prevSelected, id] // Select
    );
  };

  // Handle select/unselect all requests
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRequests([]); // Unselect all
    } else {
      setSelectedRequests(currentItems.map((request) => request.id)); // Select all visible requests
    }
    setSelectAll(!selectAll);
  };

  // Uncheck "Select All" if any individual checkbox is unselected
  useEffect(() => {
    if (selectedRequests.length !== currentItems.length) {
      setSelectAll(false);
    } else if (selectedRequests.length === currentItems.length && currentItems.length > 0) {
      setSelectAll(true);
    }
  }, [selectedRequests, currentItems]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-center text-sm">
          <thead>
            <tr className="border-b dark:border-zinc-600">
              <th>
                <input
                  className="rounded-md focus:outline-none focus:ring-transparent text-teal-400"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              {req_column.slice(1).map((column) => (
                <th key={column} className="px-6 py-2 text-gray-600 dark:text-gray-200 font-bold">
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
                  <td className="px-6 py-2">
                    <input
                      className="rounded-md focus:outline-none focus:ring-transparent text-teal-400"
                      type="checkbox"
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRejRequest(request.id)}
                    />
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    <CopyableText text={request.id} />
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {request.name}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {request.date}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {request.rejected_date}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {request.note}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
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

      {/* Popup Effect for Selected Items */}
      {selectedRequests.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="fixed bottom-5 max-w-fit border rounded-lg text-sm shadow-md border-zinc-700 bg-zinc-800 text-white p-4 flex justify-between gap-10 items-center transition-transform transform translate-y-0 animate-slide-up">
            <div className="flex gap-3">
              <div className="text-gray-200 bg-teal-400 px-2 rounded-md">{selectedRequests.length}</div>
              <p>Rejected Request(s) Selected</p>
            </div>
            <div>
              <button
                className="px-4 py-2 mr-2 rounded- text-white hover:text-gray-400"
                onClick={() => setSelectedRequests([])}
              >
                Cancel
              </button>
              <button
                className=" px-4 py-2 rounded-md border border-gray-500 hover:border-white"
                onClick={() => console.log("Delete selected requests")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rejected;
