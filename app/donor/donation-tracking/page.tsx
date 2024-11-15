"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import {
  FaClipboardList,
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaHandHolding,
} from "react-icons/fa";

interface DonationItem {
  id: string;
  itemName: string;
  quantity: number;
}

interface StatusLog {
  id: string;
  status: DonationStatus;
  timestamp: string;
  remarks: string | null;
}

interface Donation {
  id: string;
  controlNumber: string;
  donationStatus: DonationStatus;
  statusLogs: StatusLog[];
  donationItems: DonationItem[];
  createdAt: string;
  updatedAt: string;
  barangayId: string;
  donorId: string;
  name: string;
  barangayName: string;
}

enum DonationStatus {
  PLEDGED = "PLEDGED",
  COLLECTED = "COLLECTED",
  PROCESSING = "PROCESSING",
  IN_TRANSIT = "IN_TRANSIT",
  RECEIVED = "RECEIVED",
}

interface Post {
  id: string;
  area: string;
  person: string;
  typeOfCalamity: string;
  inKind: string;
}

export default function DonationTracking() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/donations?postId=${postId}&isFeed=true`);
        if (!response.ok) {
          throw new Error(`Failed to fetch donations: ${response.statusText}`);
        }
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setError("Failed to load donations.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchData();
    }
  }, [postId]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="hero-background bg-cover max-h-[20rem] mb-5 sticky top-16 z-40">
        <div className="flex flex-col justify-center py-5 backdrop-blur-sm bg-black/25 w-full">
          <h1 className="mb-0 py-0 text-3xl font-bold text-center text-white">
            Donation Tracking for {donations.length > 0 ? donations[0].barangayName : "Barangay"}
          </h1>
          <p className="text-center text-white mt-2 text-lg">
            {postId}
          </p>
        </div>
      </div>
      {donations.length === 0 ? (
        <p>No donations found for this post.</p>
      ) : (
        donations.map((donation: any) => (
          <DonationTrackingCard key={donation.id} donation={donation} />
        ))
      )}
    </div>
  );
}

function DonationTrackingCard({ donation }: { donation: Donation }) {
  const statusOrder = [
    "PLEDGED",
    "COLLECTED",
    "PROCESSING",
    "IN_TRANSIT",
    "RECEIVED",
  ];
  const currentStatusIndex = statusOrder.indexOf(donation.donationStatus);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden m-10">
      <div className="bg-primary text-white py-2 px-4">
        {donation.controlNumber} 
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          {statusOrder.map((status: string, index: number) => (
            <div key={status} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index <= currentStatusIndex
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {getStatusIcon(status)}
              </div>
              <div className="text-xs mt-2 text-center">
                {formatStatus(status)}
                <br />
                <span className="text-gray-500">
                  {index <= currentStatusIndex
                    ? getStatusDate(donation, status)
                    : "Date"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {donation.statusLogs.map((log: any) => (
            <div key={log.id} className="flex items-start">
              <div className="w-3 h-3 rounded-full bg-primary mt-1.5 mr-3"></div>
              <div>
                <div className="text-sm font-semibold">
                  {formatDate(log.timestamp)}
                </div>
                <div className="text-sm text-gray-600">{log.remarks}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h5 className="font-semibold text-gray-700 mb-2">Donated Items:</h5>
          {donation.donationItems.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {donation.donationItems.map((item: any) => (
                <li key={item.id}>
                  {item.itemName}: {item.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items found for this donation.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case "PLEDGED":
      return <FaClipboardList className="w-6 h-6" />;
    case "COLLECTED":
      return <FaCheckCircle className="w-6 h-6" />;
    case "PROCESSING":
      return <FaBox className="w-6 h-6" />;
    case "IN_TRANSIT":
      return <FaTruck className="w-6 h-6" />;
    case "RECEIVED":
      return <FaHandHolding className="w-6 h-6" />;
    default:
      return "❓";
  }
}

function formatStatus(status: string) {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase().replace("_", " ")
  );
}

function getStatusDate(donation: Donation, status: string) {
  const log = donation.statusLogs.find((log) => log.status === status);
  return log ? formatDate(log.timestamp) : "";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date
    .getFullYear()
    .toString()
    .substr(-2)} ${formatTime(date)}`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
