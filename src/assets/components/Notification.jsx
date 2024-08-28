import React, { useState, useEffect, useRef } from 'react';
import { IoIosNotifications } from "react-icons/io";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-3 text-zinc-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
        onClick={toggleNotifications}
      >
        <IoIosNotifications className="text-2xl" />
        {/* Optional: Add badge or notification count here */}
      </button>

      {/* Notification dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-gray-700 dark:text-white">Notifications</h4>
          </div>
          <ul className="py-2">
            {/* Example notification items */}
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <p className="text-gray-700 dark:text-white">You have a new message</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">2 mins ago</p>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <p className="text-gray-700 dark:text-white">Your profile was viewed</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">10 mins ago</p>
            </li>
            {/* Add more notification items as needed */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
