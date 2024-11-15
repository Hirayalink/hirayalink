"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import Navbar from "@/components/admin/navigation/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-green-200 p-4 flex justify-end items-center">
          {session?.user ? (
            <div className="relative flex items-center">
              <div className="text-right mr-4">
                <p className="font-semibold">
                  <span>{session.user.name || "User"}</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span>{session.user.brgyName || "N/A"}</span>
                </p>
              </div>
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="text-gray-600 hover:text-gray-800 ml-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaChevronDown className={`transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                <ul 
                  tabIndex={0}
                  className={`dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-52 ${
                    isDropdownOpen ? "" : "hidden"
                  }`}
                >
                  <li>
                    <Link href="/logout">
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-auto ml-0 md:ml-72">
          {children}
        </main>
      </div>
    </div>
  );
}
