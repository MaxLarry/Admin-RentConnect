import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Pagination from "../../ui/Pagination";
import CopyableText from "../../ui/CopyableText";

function Approved({ searchQuery }) {
  const [approvedProperty, setApprovedProperty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/requests/approved-properties");

        if (response.data && response.data.length > 0) {
          setApprovedProperty(response.data);
        } else {
          setApprovedProperty([]);
        }
      } catch (error) {
        console.error("There was an error fetching the approved properties!", error);
        setError("Failed to fetch approved properties");
        setApprovedProperty([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRequests();
  }, []);

  const req_column = [
    "ID", "Owner's Name", "Property Type", "Location", "No. of Rooms/Units", "Listed Date"
  ];

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredRequests = approvedProperty.filter((property) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const requestId = property._id ? property._id.toLowerCase() : "";
    const fullName = property.profile?.fullName
      ? property.profile.fullName.toLowerCase()
      : "";
    const createdAt = property.created_at
      ? format(new Date(property.created_at), "yyyy-MM-dd HH:mm").toLowerCase()
      : "";

    return (
      requestId.includes(lowerCaseQuery) ||
      fullName.includes(lowerCaseQuery) ||
      createdAt.includes(lowerCaseQuery)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-center text-xs">
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
              currentItems.map((property, index) => (
                <tr
                  key={property._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-zinc-700"
                      : "bg-white dark:bg-zinc-800"
                  }`}
                >
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200 relative">
                    <CopyableText text={property._id} onCopy={() => handleCopy(property._id)} />
                    {copiedId === property._id && (
                      <span className="text-green-500">Copied!</span>
                    )}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {property.profile?.fullName || "N/A"}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {property.typeOfProperty || "N/A"}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {property.address || "N/A"}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {property.roomCount || 0}
                  </td>
                  <td className="px-6 py-2 text-gray-700 dark:text-gray-200">
                    {property.created_at ? format(new Date(property.created_at), 'yyyy-MM-dd HH:mm') : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 dark:text-gray-200">
                  No properties available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredRequests.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Approved;
