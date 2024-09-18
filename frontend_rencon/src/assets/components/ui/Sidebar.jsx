import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { links, support } from "../../constants";
import LinkItem from "./LinkItem";
import { RiMoonFill } from "react-icons/ri";
import { useTheme } from "@/components/ui/theme-provider"; // Import useTheme hook

const Sidebar = ({ isSidebarOpen }) => {
  const { theme, setTheme } = useTheme(); // Use theme and setTheme from useTheme hook
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    switch (path) {
      case "/dashboard":
        setActiveLink("Dashboard");
        break;
      case "/listing-management":
        setActiveLink("Listing Management");
        break;
      case "/user-management":
        setActiveLink("User Management");
        break;
      case "/compliance-safety":
        setActiveLink("Compliance & Safety");
        break;
      case "/inbox":
        setActiveLink("Inbox");
        break;
      case "/activity-logs":
        setActiveLink("Log Activity");
        break;
      default:
        setActiveLink(""); // Reset if no match
        break;
    }
  }, [location]);

  // Toggle between light and dark themes
  const toggleDarkMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-60 h-screen pt-20 bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-zinc-900 dark:border-zinc-800 shadow-lg transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full px-5 pb-4 overflow-y-auto">
        <h2 className="font-light pb-2 px-3 text-gray-500 text-sm">MENU</h2>
        <ul className="space-y-2 text-sm font-normal">
          {links.map((item, index) => (
            <LinkItem
              key={index}
              {...item}
              isActive={activeLink === item.text}
              onClick={() => setActiveLink(item.text)} // Optionally handle clicking on links
            />
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-500">
          <h2 className="font-light pb-2 px-3 text-gray-500 text-sm">SUPPORT</h2>
          <ul className="space-y-2 text-sm font-normal">
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
            <RiMoonFill className="mr-2 text-lg" />
            <span className="mr-3 text-sm">Dark Mode</span>
            <label className="flex items-center w-12 h-6 relative cursor-pointer">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleDarkMode}
                className="hidden"
              />
              <span
                className={`block w-4/6 h-4 rounded-full transition-all duration-300 ease-in-out ${
                  theme === "dark" ? "bg-green-400" : "bg-gray-300"
                }`}
              />
              <span
                className={`absolute top-1.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                  theme === "dark" ? "translate-x-[1.0rem]" : "translate-x-0"
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
