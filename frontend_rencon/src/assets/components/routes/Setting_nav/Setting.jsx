import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate,useLocation } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import SettingTabs from "./SettingTabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import MyProfile from "./tabs/MyProfile"
//import AccountSetting from "./tabs/AccountSetting"

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const navigate = useNavigate();
  const location = useLocation();

  // Get tab name from URL
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "My Profile";

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
      case "My Profile":
        return <MyProfile />;
      case "Account Setting":
        return ;
      case "Security Setting":
        return;
      case "Notification":
        return ;
      default:
        return null;
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard"); // Navigate back to the Dashboard Admin page
  };

  return (
    <ScrollArea className="flex flex-col lg:p-20 p-10 min-h-screen translate-all duration-300 overflow-auto">
      <div className="border-b pb-4">
        <div className="flex items-center space-x-2 noselect">
          <IoIosArrowBack className="text-2xl cursor-pointer" onClick={handleBackClick} // Add click handler 
          />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="font-thin text-sm px-8">
          Manage your account setting and preferences.
        </p>
      </div>
      <div className="grid gap-4 p-4 pt-10 grid-cols-6 max-w-full mx-0">
        <SettingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="lg:col-start-2 lg:col-end-7 lg:row-start-1 lg:row-end-3">
          <CardContent>{renderContent()}</CardContent>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Settings;
