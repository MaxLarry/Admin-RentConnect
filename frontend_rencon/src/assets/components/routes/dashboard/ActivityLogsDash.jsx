import React, { useState, useEffect } from "react";
import axios from "axios";
import CopyableText from "../../ui/CopyableText";
import { Button } from "@/components/ui/button";
import { parse, isAfter, isBefore, format } from "date-fns";
import useAuth from "../../auth/useAuth";
import {
  Card,
  CardContent,
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
  const { user } = useAuth();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState([]);

  const logColumn = [
    "Log ID",
    "Admin Name",
    "Role",
    "Action",
    "Timestamp",
    "IP Address",
    "Entity Affected",
    "Changes Made",
  ];


  // Filter logs based on search, role, action, and date range
  const filteredLogs = activityLogs
    
    .sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  // Pagination logic
  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);


  // Fetch all activity logs
  useEffect(() => {
    const fetchActivityLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/logs/admin-activity-logs");
        setActivityLogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("There was an error fetching the Activity Logs!", error);
        setActivityLogs([]); // Fallback in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-4 shadow-md col-start-1 lg:col-end-7 md:col-end-3">
      <CardContent className="p-3">
        <h2 className="text-lg font-bold mb-2">Activity Logs</h2>
        <div className="overflow-auto rounded-md py-3">
          <div className="border rounded-lg">
          <Table className="min-w-full dark:border-zinc-600">
          <TableHeader>
            <TableRow className="border-b dark:border-zinc-600">
              {logColumn.map((column) => (
                <TableHead
                  key={column}
                  className="text-zinc-900 dark:text-gray-200 font-bold"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => (
                <TableRow key={log._id} className="cursor-pointer">
                  <TableCell>
                    <CopyableText
                      text={log._id}
                      onCopy={() => console.log("Copying ID")}
                    />
                  </TableCell>
                  <TableCell>{log.admin_name}</TableCell>
                  <TableCell>{log.role}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {log.timestamp
                      ? format(new Date(log.timestamp), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{log.ip_address}</TableCell>
                  <TableCell>{log.entity_affected}</TableCell>
                  <TableCell>{log.changes ? log.changes : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={logColumn.length + 1}
                  className="text-center"
                >
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
          </div>
          {filteredLogs.length > 0 && totalPages > 0 && (
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="text-xs"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="text-xs"
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivityLog;
