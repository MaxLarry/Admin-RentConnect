import React from 'react';

function Rejected() {
  const listingRequests = [
    { id: 1, name: 'John Doe', status: 'Pending', date: '2024-09-05' },
    { id: 2, name: 'Jane Smith', status: 'Approved', date: '2024-09-04' },
    { id: 3, name: 'Michael Johnson', status: 'Rejected', date: '2024-09-03' },
    { id: 34, name: 'Michael Johnson', status: 'Rejected', date: '2024-09-03' },
    { id: 23, name: 'Michael Johnson', status: 'Rejected', date: '2024-09-03' },
    { id: 34, name: 'Michael Johnson', status: 'Rejected', date: '2024-09-03' },
    // Add more listing requests here
  ];

  const req_column = ["ID", "Requester Name", "Status", "Requested Date", "Action"];

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
        <table className="min-w-full bg-white border border-gray-200 text-center text-sm">
          <thead>
            <tr className=" border-b">
              {req_column.map((column) => (
                <th key={column} className="px-6 py-2 text-gray-600 font-bold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listingRequests.map((request, index) => (
              <tr
                key={request.id}
                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
              >
                <td className="px-6 py-2 text-gray-700">{request.id}</td>
                <td className="px-6 py-2 text-gray-700">{request.name}</td>
                <td className={`px-6 py-2 font-medium ${
                  request.status === 'Approved'
                    ? 'text-green-500'
                    : request.status === 'Rejected'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}>
                  {request.status}
                </td>
                <td className="px-6 py-2 text-gray-700">{request.date}</td>
                <td className="px-6 py-2">
                  <div className="flex justify-center space-x-2">
                    <span
                      onClick={() => handleReview(request.id)}
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      Review
                    </span>
                    <span className="text-gray-400">|</span>
                    <span
                      onClick={() => handleApprove(request.id)}
                      className="cursor-pointer text-green-500 hover:underline"
                    >
                      Approve
                    </span>
                    <span className="text-gray-400">|</span>
                    <span
                      onClick={() => handleDecline(request.id)}
                      className="cursor-pointer text-red-500 hover:underline"
                    >
                      Decline
                    </span>
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

export default Rejected;
