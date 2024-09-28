import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import from react-router-dom
import UserTabs from "./usertabs";
import ListAllAdmin from "./Admin/ListAllAdmin";
import ListAllLandlord from "./Landlord/ListAllLandlord";
import ListAllOccupant from "./Occupant/ListAllOccupant";
import ListAllUSerVerification from "./ListAllUSerVerification";
import {
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab name from URL
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "Landlords";
  
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
      case "Landlords":
        return <ListAllLandlord />;
      case "Occupants":
        return <ListAllOccupant  />;
      case "Admins":
        return <ListAllAdmin  />;
      case "User Verification":
        return <ListAllUSerVerification  />;
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="px-4 pt-14 sm:ml-60 h-full block gap-2 flex-col lg:flex-row translate-all
    duration-300">
      <div className="flex justify-between items-center px-5 p-9">
        <h1 className="font-bold text-2xl">User Management</h1>
      </div>

      <div className="grid gap-4 p-4 grid-cols-1 lg:grid-cols-6 max-w-full mx-auto">
        <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="lg:col-start-2 lg:col-end-7 lg:row-start-1 lg:row-end-3">
          <CardContent>{renderContent()}</CardContent>
        </div>
      </div>
    </ScrollArea>
  );
}

export default UserManagement;
