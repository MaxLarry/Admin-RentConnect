import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Outlet renders child routes
import Header from "../ui/Header";
import Sidebar from "../ui/Sidebar";
import { ThemeProvider, useTheme } from "@/components/ui/theme-provider"; // Use the updated ThemeProvider and useTheme
import { Toaster } from "@/components/ui/sonner";

function Layout() {
  const { theme, setTheme } = useTheme(); // Access theme and setTheme from useTheme hook
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleDarkMode = () => {
    // Toggle between light and dark themes
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (    
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleDarkMode={toggleDarkMode}
        darkMode={theme === "dark"} // Pass the current theme as a prop
      />
      <Outlet />
      <Toaster />
  </ThemeProvider>
  );
}

export default Layout;
