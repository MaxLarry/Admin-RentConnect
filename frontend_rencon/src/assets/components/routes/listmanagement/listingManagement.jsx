import React, { useState } from 'react';
import Pending from './Pending';
import Rejected from './Rejected';
import Approved from './Approved';
import TabsButton from './TabsButton';

function ListingManagement() {
  const [activeTab, setActiveTab] = useState("Pending");

  const renderContent = () => {
    switch (activeTab) {
      case "Pending":
        return <Pending />;
      case "Approved":
        return <Approved />;
      case "Rejected":
        return <Rejected />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:ml-64 h-full block gap-2 flex-col lg:flex-row translate-all duration-300 mt-14">
      <h1 className="font-bold text-2xl p-4 text-gray-700 dark:text-gray-200">
        Listing Management
      </h1>
      <TabsButton activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default ListingManagement;
