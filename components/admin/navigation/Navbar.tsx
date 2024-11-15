"use client";

import React, { useState, useEffect } from "react";
import FullMenu from "@/components/admin/navigation/FullMenu";

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 h-screen w-72">
      {isMobile && (
        <button 
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-20 text-white bg-primary p-2 rounded-md"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      )}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out' : ''}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <FullMenu />
      </div>
    </nav>
  );
};

export default Navbar;
