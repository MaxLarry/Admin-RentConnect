import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"; // Outlet renders child routes
import Header from "../ui/Header";
import Sidebar from "../ui/Sidebar";

function Layout({ darkMode, toggleDarkMode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-auto bg-slate-100 dark:bg-zinc-900">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      <Outlet />
    </div>
  );
}

export default Layout;
