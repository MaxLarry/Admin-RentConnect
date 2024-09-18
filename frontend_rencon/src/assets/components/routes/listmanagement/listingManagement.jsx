import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Pending from './Pending';
import Rejected from './Rejected';
import Approved from './Approved';
import TabsButton from './TabsButton';

function ListingManagement() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");

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
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl p-4 text-gray-700 dark:text-gray-200">
          Listing Management
        </h1>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 dark:text-zinc-900"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>
      <TabsButton activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default ListingManagement;
