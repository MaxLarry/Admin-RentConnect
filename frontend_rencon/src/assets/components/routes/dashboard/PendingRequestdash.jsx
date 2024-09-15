import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../ui/Pagination";

function PendingRequestdash() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const itemsPerPage = 10; // Adjust this number as needed

  // Sample data for pending requests (you can replace this with actual data later)
  const pendingRequests = [
    { id: 1, requesterName: "John Doe", date: "2024-09-01", status: "Under Review" },
    { id: 2, requesterName: "Jane Smith", date: "2024-09-02", status: "Passed" },
    { id: 322, requesterName: "Michael Brown", date: "2024-09-03", status: "Failed" },
    { id: 311, requesterName: "Michael Browen", date: "2024-09-23", status: "Failed" },
    { id: 32, requesterName: "Miguel Brown", date: "2024-09-30", status: "Failed" },
    { id: 34, requesterName: "Tony Brown", date: "2024-09-03", status: "Failed" },
    { id: 36, requesterName: "Shawn Brown", date: "2024-09-03", status: "Failed" },
    { id: 38, requesterName: "Jerome Brown", date: "2024-09-03", status: "Failed" },
    { id: 39, requesterName: "Nike Brown", date: "2024-09-03", status: "Failed" },
    { id: 13, requesterName: "ZMike Brown", date: "2024-09-03", status: "Failed" },
    // Add more sample data if needed
  ];

  // Filter requests based on search query for requesterName, id, and status
  const filteredRequests = pendingRequests.filter((request) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      request.requesterName.toLowerCase().includes(lowerCaseQuery) ||
      request.id.toString().includes(lowerCaseQuery) ||
      request.status.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Sorting logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (key === 'date') {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(a[key]);
      const dateB = new Date(b[key]);
      if (dateA < dateB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (dateA > dateB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    } else {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    }
  });

  // Pagination logic
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = sortedRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  // Handle sorting change
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 p-5 rounded-md shadow-md block items-center lg:col-start-1 lg:col-end-4 lg:row-start-2 lg:row-end-5 md:col-start-1 md:col-end-3 relative">
      <div className="flex justify-between mb-4">
        <span className="text-lg font-bold text-zinc-900 dark:text-white">Pending Requests</span>
        <div className="relative w-auto h-10">
          <input
            type="text"
            placeholder="Search by Name, ID, or Status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 dark:border-zinc-600 p-2 pl-10 w-full rounded-md h-8 focus:outline-none focus:ring-teal-400 dark:bg-zinc-700 dark:text-white"
          />
          <FiSearch className="absolute left-3 top-2 text-gray-500 dark:text-gray-300" />
        </div>
      </div>
      <div className="justify-center overflow-x-auto">
        <table className="min-w-full bg-white text-center dark:bg-zinc-800 text-sm">
          <thead>
            <tr className="border-b dark:border-zinc-500">
              <th className="px-6 py-2 text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => handleSort('id')}>
                ID
              </th>
              <th className="px-6 py-2 text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => handleSort('requesterName')}>
                Requester Name {sortConfig.key === 'requesterName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-2 text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-2 text-gray-700 dark:text-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((request, index) => (
                <tr key={request.id} className={`${index % 2 === 0 ? 'bg-gray-100 dark:bg-zinc-700' : 'bg-white dark:bg-zinc-800'}`}>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">{request.id}</td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">{request.requesterName}</td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">{request.date}</td>
                  <td className={`px-6 py-2 ${
                    request.status === 'Under Review'
                      ? 'text-green-500'
                      : request.status === 'Passed'
                      ? 'text-blue-500'
                      : 'text-red-500'
                  }`}>
                    {request.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 dark:text-gray-200">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalItems={filteredRequests.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default PendingRequestdash;
