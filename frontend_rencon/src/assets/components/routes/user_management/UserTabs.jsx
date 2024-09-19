import React from "react";

function UserTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "All Users",
    "Landlords",
    "Occupants",
    "Admins",
    "Verification",
  ];

  const handleClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <ul className="cursor-pointer space-y-2 text-sm font-normal lg:space-y-2 border-l-2">
      {tabs.map((tab, index) => (
        <li
          key={index}
          onClick={() => handleClick(tab)}
          className={`items-center p-2 block border-l-2 pl-4 -ml-px border-transparent hover:border-teal-400 dark:hover:border-teal-500 ${
            activeTab === tab
              ? 'border-teal-500 text-teal-500' // Add styles for the active tab here
              : ''
          } hover:text-neutral-400 dark:hover:text-neutral-500`}
        >
          <span className="flex-1 tracking-tighter">{tab}</span>
        </li>
      ))}
    </ul>
  );
}

export default UserTabs;
