import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Pagination from "../../ui/Pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ActivityLog() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);

  // Logs array
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
    "Action",
    "Timestamp",
    "IP Address",
    "Entity Affected",
    "Role",
  ];

  const truncateId = (id) => `${id.slice(0, 5)}...`;

  // Pagination logic
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <Card className="p-4 shadow-md col-start-1 lg:col-end-7 md:col-end-3">
      <CardContent className="p-3">
        <h2 className="text-lg font-bold mb-2">Activity Logs</h2>
        <div className="overflow-auto rounded-md py-3">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {req_column.map((column) => (
                    <TableHead key={column} className="font-bold">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{truncateId(log.id)}</TableCell>
                    {/*<TableCell className="px-6 py-2 ">
                      <CopyableText
                        text={request._id}
                        onCopy={() => handleCopy(request._id)}
                      />
                    </TableCell> */}
                    <TableCell>{log.adminName}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell>{log.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/*filteredRequests.length > 0 && totalPages >= 1 && (
        <Pagination className="mt-4 cursor-pointer">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationContent>
        </Pagination>
      )*/}
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivityLog;
