import React, { useState } from "react";
import Header from "../components/Header";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X } from "lucide-react";

import Sidebar from "../components/Sidebar";

const Main = () => {
  const { user } = useAuth();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const closeMobileSidebar = () => {
    setShowMobileSidebar(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 min-h-screen">
      <Header />
      
      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden p-4">
        <button 
          onClick={toggleMobileSidebar}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md"
        >
          {showMobileSidebar ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start gap-4 px-4  md:px-0">
        {/* Mobile sidebar overlay background - animated opacity */}
        <div 
          className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-in-out ${
            showMobileSidebar ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={closeMobileSidebar}
        ></div>
        
        {/* Mobile sidebar - animated left position */}
        <div 
          className={`fixed left-0 top-0 h-full w-[280px] bg-white rounded-r-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4">
            <Sidebar onClose={closeMobileSidebar} />
          </div>
        </div>
        
        {/* Desktop sidebar - always visible on md+ screens */}
        <div className="hidden md:block sticky top-4">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className={`flex-1 p-2 md:p-4 bg-white rounded-xl shadow-lg overflow-auto mb-10 w-full`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;