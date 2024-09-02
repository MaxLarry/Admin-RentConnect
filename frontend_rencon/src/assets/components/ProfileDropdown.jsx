import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { HiLogout } from "react-icons/hi";
import { TiUser } from "react-icons/ti";
import logout from './auth/useauth';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
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
        onClick={toggleDropdown}
      >
        <FaUserCircle className="text-4xl" />
        <span className="text-zinc-900 dark:text-white flex-1 tracking-s font-medium">
          Juanico D.
        </span>
        {isOpen ? (
          <FiChevronUp className="text-xl" /> // Up arrow when open
        ) : (
          <FiChevronDown className="text-xl" /> // Down arrow when closed
        )}
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden z-50">
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            >
              <TiUser className="mr-2" /> My Profile
            </a>
          </li>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            >
              <MdManageAccounts className="mr-2" /> Account Setting
            </a>
          </li>
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              onClick={logout}
            >
              <HiLogout className="mr-2" /> Logout
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
