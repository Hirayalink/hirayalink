"use client";

import React, { useState, useEffect } from "react";
import FullMenu from "@/components/admin/navigation/FullMenu";

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Overlay for mobile when menu is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`
        fixed top-0 left-0 h-screen z-40
        ${isMobile ? 'pointer-events-none' : ''}
      `}>
        {/* Mobile Toggle Button */}
        {isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-primary text-white hover:bg-primary/90 pointer-events-auto"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        )}

        {/* Navigation Content */}
        <div className={`
          pointer-events-auto
          ${isMobile ? [
            'transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          ].join(' ') : ''}
        `}>
          <FullMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
