import React, { useState } from "react";
import { FaUserCircle, FaPowerOff } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TiUser } from "react-icons/ti";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
                        <button
        className="flex items-center space-x-2 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
        onClick={toggleDropdown}
      >
        <FaUserCircle className="text-4xl" />
        <span className="text-gray-700 dark:text-white">Juanico D.</span>
        {isOpen ? (
          <FiChevronUp className="text-xl" /> // Up arrow when open
        ) : (
          <FiChevronDown className="text-xl" /> // Down arrow when closed
        )}
      </button>


      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
          <li className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src="/path/to/profile.png"
                alt="user"
                className="w-12 h-12 rounded-full"
              />
              <div className="text-gray-700 dark:text-white">
                <h4>LarrYuan</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  JohnIco@bsit.appdev.com
                </p>
                <a
                  href="profile.html"
                  className="mt-2 inline-block bg-red-500 text-white text-xs px-4 py-2 rounded-full"
                >
                  View Profile
                </a>
              </div>
            </div>
          </li>
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            >
              <TiUser className="mr-2" /> My Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            >
              My Balance
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            >
             Inbox
            </a>
          </li>
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            >
              Account Setting
            </a>
          </li>
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
            >
              <FaPowerOff className="mr-2" /> Logout
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
