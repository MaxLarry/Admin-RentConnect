import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../ui/Pagination";
import CopyableText from "../../ui/CopyableText";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ActivityLogs() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedAction, setSelectedAction] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const logs = [
    {
      id: "09876w543210987654d321",
      adminName: "John Doe",
      action: "Added a listing",
      timestamp: "2024-09-12 10:23:45",
      ipAddress: "192.168.0.1",
      target: "Listings",
      role: "Super-Admin",
    },
    {
      id: "09876w54321s0987654321",
      adminName: "Jane Smith",
      action: "Updated user info",
      timestamp: "2024-09-12 11:05:22",
      ipAddress: "192.168.0.2",
      target: "User Management",
      role: "Admin",
    },
    // More log entries
  ];

  const req_column = [
    "Log ID",
    "Admin Name",
    "Role",
    "Action",
    "Timestamp",
    "IP Address",
    "Entity Affected",
    "Changes Made",
  ];

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle filter by role
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Handle filter by action
  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
  };

  // Filter logs based on search, role, action, and date range
  const filteredLogs = logs.filter((log) => {
    const isMatchSearchQuery =
      log.adminName.toLowerCase().includes(searchQuery) ||
      log.action.toLowerCase().includes(searchQuery) ||
      log.id.toLowerCase().includes(searchQuery);

    const isMatchRole = selectedRole === "All" || log.role === selectedRole;
    const isMatchAction = selectedAction === "All" || log.action === selectedAction;

    const isWithinDateRange =
      (!startDate || new Date(log.timestamp) >= startDate) &&
      (!endDate || new Date(log.timestamp) <= endDate);

    return isMatchSearchQuery && isMatchRole && isMatchAction && isWithinDateRange;
  });

  // Pagination logic
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <div className="p-4 sm:ml-64 min-h-screen block gap-2 flex-col lg:flex-row translate-all duration-300 mt-14">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl p-4 text-gray-700 dark:text-gray-200">
          Activity Logs
        </h1>
      </div>

      {/* Search, Role Filter, Action Filter, and Date Picker */}
      <div className="flex flex-wrap gap-4 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            className="p-1 rounded-md border dark:bg-zinc-700 dark:text-gray-200 focus:ring-teal-400"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FiSearch className="absolute right-3 top-2 text-gray-400" />
        </div>

        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="p-1 rounded-md text-xs dark:bg-zinc-700 dark:text-gray-200 focus:ring-teal-400"
        >
          <option value="All">All Roles</option>
          <option value="Super-Admin">Super-Admin</option>
          <option value="Admin">Admin</option>
        </select>

        <select
          value={selectedAction}
          onChange={handleActionChange}
          className="p-1 rounded-md text-xs dark:bg-zinc-700 dark:text-gray-200 focus:ring-teal-400"
        >
          <option value="All">All Actions</option>
          <option value="Added a listing">Added a listing</option>
          <option value="Updated user info">Updated user info</option>
          {/* Add other actions as needed */}
        </select>

        <div className="flex items-center">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="p-2 rounded-md border dark:bg-zinc-700 dark:text-gray-200"
          />
          <span className="mx-2">to</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="p-2 rounded-md border dark:bg-zinc-700 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="overflow-auto rounded-md px-3">
        <table className="min-w-full bg-white text-center text-sm">
          <thead className="bg-gray-200 dark:bg-zinc-700">
            <tr className="border-b dark:border-zinc-600">
              {req_column.map((column) => (
                <th key={column} className="px-6 py-2 text-gray-700 dark:text-gray-200 font-bold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b dark:text-gray-200 dark:bg-zinc-800 dark:border-zinc-700"
              >
                <td className="py-2 px-4">
                  <CopyableText text={log.id} />
                </td>
                <td className="py-2 px-4">{log.adminName}</td>
                <td className="py-2 px-4">{log.role}</td>
                <td className="py-2 px-4">{log.action}</td>
                <td className="py-2 px-4">{log.timestamp}</td>
                <td className="py-2 px-4">{log.ipAddress}</td>
                <td className="py-2 px-4">{log.target}</td>
                <td className="py-2 px-4">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default ActivityLogs;
