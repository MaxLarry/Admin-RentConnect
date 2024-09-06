import React from 'react';

function Pending() {
  const listingRequests = [
    { id: 1, name: 'John Doe', status: 'Pending', date: '2024-09-05' },
    { id: 2, name: 'Jane Smith', status: 'Approved', date: '2024-09-04' },
    { id: 3, name: 'Michael Johnson', status: 'Rejected', date: '2024-09-03' },
    // Add more listing requests here
  ];

  const req_column = [
    "ID", "Requester Name", "Status", "Requested Date", "Action"
  ];

  const handleReview = (id) => {
    // Add your review logic here
    console.log(`Review request with ID: ${id}`);
  };

  const handleApprove = (id) => {
    // Add your approve logic here
    console.log(`Approve request with ID: ${id}`);
  };

  const handleDecline = (id) => {
    // Add your decline logic here
    console.log(`Decline request with ID: ${id}`);
  };

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
              <tr key={request.id} className="border-b">
                <td className="px-6 py-4 text-gray-700">{request.id}</td>
                <td className="px-6 py-4 text-gray-700">{request.name}</td>
                <td className={`px-6 py-4 text-gray-700 font-medium ${
                  request.status === 'Approved'
                    ? 'text-green-500'
                    : request.status === 'Rejected'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}>
                  {request.status}
                </td>
                <td className="px-6 py-4 text-gray-700">{request.date}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleReview(request.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Decline
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

export default Pending;
