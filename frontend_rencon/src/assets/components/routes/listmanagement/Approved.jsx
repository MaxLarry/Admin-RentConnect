import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function Approved() {
  const [listingRequests, setListingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('/requests/listing-requests')
      .then(response => {
        setListingRequests(response.data); // Assume the data is an array of requests
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the listing requests!", error);
        setError("Failed to fetch listing requests");
        setLoading(false);
      });
  }, []);

  const req_column = [
    "ID", "Owner's Name", "Property Type", "Location", "No. of Rooms/Units", "Listed Date", "Status", "Actions"
  ];

  const handleView = (id) => {
    // Add your review logic here
    console.log(`Review request with ID: ${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (listingRequests.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-center">
          <thead>
            <tr className="bg-gray-100 border-b">
              {req_column.map((column) => (
                <th key={column} className="px-6 py-3 text-gray-600 font-bold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listingRequests.map((request) => (
              <tr key={request._id} className="border-b">
                <td className="px-6 py-4 text-gray-700">{request._id}</td>
                <td className="px-6 py-4 text-gray-700">{request.name}</td>
                <td className="px-6 py-4 text-gray-700">{request.propertyType}</td>
                <td className="px-6 py-4 text-gray-700">{request.address}</td>
                <td className="px-6 py-4 text-gray-700">{request.numberOfRooms}</td>
                <td className="px-6 py-4 text-gray-700">{format(new Date(request.createdAt), 'yyyy-MM-dd')}</td>
                <td
                  className={`px-6 py-4 font-medium ${
                    request.status === "Approved"
                      ? "text-green-500"
                      : request.status === "Rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {request.status}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleView(request._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Approved;
