"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { HiPrinter } from "react-icons/hi";
import { generateReport } from "@/components/admin/navigation/reportGenerator";
import { useState } from "react";

const LoadingModal = () => (
  <dialog open className="modal modal-open">
    <div className="modal-box text-center">
      <span className="loading loading-spinner loading-lg mt-4 text-success"></span>
      <h3 className="font-bold text-lg mt-4">Generating Report</h3>
      <p className="py-4">Please wait while we prepare your report...</p>
    </div>
    <div className="modal-backdrop bg-black/50"></div>
  </dialog>
);

export default function FullMenu() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/success-stories", label: "Success Stories" },
    { href: "/admin/admin-request-donation", label: "Request Donation" },
    {
      href: "/admin/manage-donation-processing",
      label: "Manage Donation Processing",
    },
    { href: "/admin/calamity-impact", label: "Calamity Impact" },
    { href: "#", label: "Generate Report", isButton: true },
  ];

  const handleReportGeneration = async () => {
    try {
      setIsGeneratingReport(true);
      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/report");
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const reportData = await response.json();
      await generateReport(reportData, session.user);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <>
      {isGeneratingReport && <LoadingModal />}
      <nav className="w-72 h-screen bg-gradient-to-b from-green-600 via-green-500 to-green-400 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-10"></div>
        <Link href="/" className="block relative z-10">
          <h1 className="text-3xl font-bold text-white p-6 mb-6 hover:text-green-100 transition-colors duration-300">
            HIRAYALINK
          </h1>
        </Link>
        <ul className="flex-grow relative z-10">
          {menuItems.map((item: any) => (
            <li key={item.label} className="relative group">
              {item.isButton ? (
                <button
                  onClick={handleReportGeneration}
                  className={`text-white py-3 px-6 transition-all duration-300 ease-in-out flex items-center justify-between`}
                >
                  <span>{item.label}</span>
                  <HiPrinter className="ml-2" />
                </button>
              ) : (
                <Link href={item.href}>
                  <span
                    className={`block text-white py-3 px-6 transition-all duration-300 ease-in-out
                                  ${
                                    pathname === item.href
                                      ? "font-bold"
                                      : "font-normal"
                                  }
                                  group-hover:bg-white group-hover:bg-opacity-10`}
                  >
                    {item.label}
                  </span>
                </Link>
              )}
              {pathname === item.href && (
                <span className="absolute left-0 top-0 w-1 h-full bg-white"></span>
              )}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 ease-in-out origin-left group-hover:scale-x-100"></span>
            </li>
          ))}
        </ul>
        <style jsx>{`
          .group:hover {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </nav>
    </>
  );
}
