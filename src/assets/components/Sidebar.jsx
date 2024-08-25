import React, { useState } from "react";
import { links, support } from "../constants";
import LinkItem from "./LinkItem";
import { RiMoonFill } from "react-icons/ri";

const Sidebar = ({ isSidebarOpen, darkMode, toggleDarkMode }) => {
  const [activeLink, setActiveLink] = useState("");

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-zinc-800 dark:border-gray-700 shadow-lg transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full px-5 pb-4 overflow-y-auto">
        <h2 className="font-light pb-2 px-3 text-gray-500">MENU</h2>
        <ul className="space-y-2 font-medium">
          {links.map((item, index) => (
            <LinkItem
              key={index}
              {...item}
              isActive={activeLink === item.text}
              onClick={() => setActiveLink(item.text)}
            />
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-500">
          <h2 className="font-light pb-2 px-3 text-gray-500">SUPPORT</h2>
          <ul className="space-y-2 font-medium">
            {support.map((item, index) => (
              <LinkItem
                key={index}
                {...item}
                isActive={activeLink === item.text}
                onClick={() => setActiveLink(item.text)}
              />
            ))}
          </ul>
          <div className="flex p-3 items-center text-gray-700 dark:text-gray-200">
            <RiMoonFill className="mr-2 text-xl" />
            <span className="mr-3">Dark Mode</span>
            <label className="flex items-center w-12 h-6 relative cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="hidden"
              />
              <span
                className={`block w-5/6 h-5/6 rounded-full transition-all duration-300 ease-in-out ${
                  !darkMode ? "bg-gray-300" : "bg-green-400"
                }`}
              />
              <span
                className={`absolute top-auto left-0.5 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                  darkMode ? "translate-x-[1.2rem]" : "translate-x-0"
                }`}
              />
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
