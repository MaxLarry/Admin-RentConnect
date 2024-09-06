import React from "react";
import { MdOutlinePendingActions } from "react-icons/md";
import { FiCheckSquare, FiTrash2 } from "react-icons/fi";

function TabsButton({ activeTab, setActiveTab }) {
  const tabs = [
    {
      name: "Pending",
      icon: <MdOutlinePendingActions size={18} />,
    },
    {
      name: "Approved",
      icon: <FiCheckSquare size={18} />,
    },
    {
      name: "Rejected",
      icon: <FiTrash2 size={18} />,
    },
  ];

  const handleClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex justify-center items-center py-5">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => handleClick(tab.name)}
          className={`flex flex-col items-center p-2 rounded-lg px-28 text-gray-700 dark:text-gray-200 ${
            activeTab === tab.name
              ? "bg-blue-500 text-white"
              : "bg-background hover:bg-secondary"
          }`}
        >
          {tab.icon}
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
}

export default TabsButton;
