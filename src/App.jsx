import React, { useState, useEffect } from 'react';
import Login from './assets/components/Login';
import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (<>
 <Login/>
 {/*
    <div className="h-full bg-slate-100 dark:bg-zinc-950">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>*/}
    </>
  );
}

export default App;
