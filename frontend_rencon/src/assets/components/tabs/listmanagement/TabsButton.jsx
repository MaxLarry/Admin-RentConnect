import React from "react";
import { MdOutlinePendingActions } from "react-icons/md";
import { FiCheckSquare, FiTrash2 } from "react-icons/fi";

function TabsButton() {
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

  return (
    <div className="flex justify-center items-center py-5">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className="flex flex-col items-center p-2 rounded-lg bg-background hover:bg-secondary  px-28"
        >
          {tab.icon}
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
}

export default TabsButton;
