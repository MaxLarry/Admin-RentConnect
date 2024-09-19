import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import from react-router-dom
import { SearchInput } from "@/components/ui/input";
import UserTabs from "./usertabs";
import ListAllUser from "./ListAllUser";
import ListAllAdmin from "./ListAllAdmin";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab name from URL
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "All Users";
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  // Update the URL when activeTab changes
  useEffect(() => {
    const currentTab = queryParams.get("tab");
    if (currentTab !== activeTab) {
      navigate(`?tab=${activeTab}`, { replace: true }); // Update URL without reloading
    }
  }, [activeTab, queryParams, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "All Users":
        return <ListAllUser />;
      case "Landlords":
        return <ListAllAdmin />;
      case "Occupants":
        return <ListAllAdmin  />;
      case "Admins":
        return <ListAllAdmin  />;
      case "Verification":
        return <ListAllAdmin  />;
      default:
        return null;
    }
  };

  return (
    <div className="px-4 pt-14 sm:ml-60 min-h-screen block gap-2 flex-col lg:flex-row translate-all duration-300">
      <div className="flex justify-between items-center p-5">
        <h1 className="font-bold text-2xl p-4">User Management</h1>
      </div>

      <div className="grid gap-4 p-4 grid-cols-1 lg:grid-cols-6 max-w-full mx-auto">
        <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Card className="lg:col-start-2 lg:col-end-7 lg:row-start-1 lg:row-end-3">
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserManagement;
