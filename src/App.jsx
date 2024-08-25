import React,{ useState} from 'react'
import Login from './assets/components/Login';
import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () =>{ setDarkMode(!darkMode)};
  const toggleSidebar = () =>{ setIsSidebarOpen(!isSidebarOpen)};

  return (
    <>
    <div className={`${darkMode && "dark"} `}>
    <Header toggleSidebar={toggleSidebar}/>
    <Sidebar isSidebarOpen={isSidebarOpen} toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>  
    </div>
    </>
  )
}

export default App
