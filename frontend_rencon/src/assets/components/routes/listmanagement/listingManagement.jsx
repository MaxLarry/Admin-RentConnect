import React, { useState, useEffect } from 'react';
import Pending from './Pending';
import Rejected from './Rejected';
import Approved from './Approved';
import TabsButton from './TabsButton';
import { useNavigate, useLocation } from "react-router-dom";
import { SearchInput } from '@/components/ui/input';

function ListingManagement() {
  
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab name from URL
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("listing") || "Pending";
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    const currentTab = queryParams.get("listing");
    if (currentTab !== activeTab) {
      navigate(`?listing=${activeTab}`, { replace: true }); // Update URL without reloading
    }
  }, [activeTab, queryParams, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "Pending":
        return <Pending searchQuery={searchQuery} />;
      case "Approved":
        return <Approved searchQuery={searchQuery} />;
      case "Rejected":
        return <Rejected searchQuery={searchQuery} />;
      default:
        return null;
    }
  };

  return (
    <div className="px-4 pt-14 sm:ml-60 min-h-screen block gap-2 flex-col lg:flex-row translate-all duration-300">
      <div className="flex justify-between items-center px-5 p-9">
        <h1 className="font-bold text-2xl">
          Listing Management
        </h1>
        <div className="relative w-96">
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 pl-10 w-full"
          />
        </div>
      </div>
      <TabsButton activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default ListingManagement;
