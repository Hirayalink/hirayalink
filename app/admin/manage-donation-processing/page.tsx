"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { FaEye } from "react-icons/fa";

interface DonationItem {
  itemName: string;
  quantity: number;
}

interface Donation {
  id: number;
  controlNumber: string;
  donationStatus: string;
  statusLogs: { status: string; timestamp: string; remarks: string }[];
  donationItems?: DonationItem[];
  donor?: {
    id: string;
    name: string;
  };
}

interface BarangayRequestPost {
  id: string;
  dateTime: string;
  donations: Donation[];
  name?: string;
  person?: string;
  contactNumber?: string;
  area?: string;
  typeOfCalamity?: string;
  inKind?: string;
  specifications?: string;
  barangay?: {
    name: string;
  };
}

export default function ManageDonationRequestPosts() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<BarangayRequestPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [isViewingItems, setIsViewingItems] = useState(false);
  const [selectedDonations, setSelectedDonations] = useState<number[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log("Fetching barangay request posts for admin");
        const res = await fetch("/api/donations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error("Server response:", res.status, errorData);
          throw new Error(
            `Failed to fetch barangay request posts: ${res.status} ${errorData}`
          );
        }

        const data: BarangayRequestPost[] = await res.json();
        console.log("Successfully fetched posts:", data.length);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch barangay request posts:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch barangay request posts"
        );
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPosts();
    }
  }, [session]);

  const handleUpdateStatus = async (
    donationId: number,
    newStatus: string,
    remarks: string
  ) => {
    try {
      const response = await fetch(`/api/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donationId,
          status: newStatus,
          remarks,
        }),
      });

      if (response.ok) {
        const updatedDonation: Partial<Donation> = await response.json();

        // Update the local state
        setPosts((prevPosts) =>
          prevPosts.map((post) => ({
            ...post,
            donations: post.donations.map((donation) =>
              donation.id === updatedDonation.id
                ? {
                    ...donation,
                    ...updatedDonation,
                    donor: donation.donor, // Preserve the existing donor information
                  }
                : donation
            ),
          }))
        );

        setSelectedDonation(null);
      } else {
        throw new Error("Failed to update donation status");
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
    }
  };

  const handleBulkUpdateStatus = async (newStatus: string, remarks: string) => {
    try {
      const response = await fetch(`/api/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donationIds: selectedDonations,
          status: newStatus,
          remarks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update donation statuses");
      }

      const updatedDonations = await response.json();

      // Update the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          donations: post.donations.map((donation) =>
            selectedDonations.includes(donation.id)
              ? {
                  ...donation,
                  donationStatus: newStatus,
                  statusLogs: [
                    ...donation.statusLogs,
                    {
                      status: newStatus,
                      timestamp: new Date().toISOString(),
                      remarks,
                    },
                  ],
                }
              : donation
          ),
        }))
      );

      setSelectedDonations([]);
    } catch (error) {
      console.error("Error updating donation statuses:", error);
      throw error; // Re-throw the error to be caught by the modal
    }
  };

  if (status === "loading") return <Loading />;
  if (!session) return <div>Please log in to view this page</div>;
  if (session.user.userType !== "admin")
    return <div>You do not have permission to view this page</div>;
  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="hero-background bg-cover max-h-[30rem] sticky top-0 z-10">
        <div className="py-10 text-center backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white">
            Manage Donation Processing
          </h1>
        </div>
      </div>
      <div className="container mx-auto p-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="mb-8 border rounded shadow overflow-hidden"
          >
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Post ID: {post.id}</h2>
              <p>{new Date(post.dateTime).toLocaleString()}</p>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <h4 className="text-md font-semibold">Donations:</h4>
                {selectedDonations.length > 0 &&
                  // Check if any selected donations belong to this post
                  selectedDonations.some((id) =>
                    post.donations.some((d) => d.id === id)
                  ) && (
                    <button
                      onClick={() => {
                        setSelectedDonation(null);
                        setIsViewingItems(false);
                        setIsUpdateModalOpen(true);
                      }}
                      className="btn btn-primary btn-sm text-white"
                    >
                      Update Selected (
                      {
                        selectedDonations.filter((id) =>
                          post.donations.some((d) => d.id === id)
                        ).length
                      }
                      )
                    </button>
                  )}
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Select</th>
                    <th className="border p-2">Control Number</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Donor</th>
                    <th className="border p-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {post.donations.length > 0 ? (
                    post.donations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedDonations.includes(donation.id)}
                            onChange={(e) => {
                              setSelectedDonations(
                                e.target.checked
                                  ? [...selectedDonations, donation.id]
                                  : selectedDonations.filter(
                                      (id) => id !== donation.id
                                    )
                              );
                            }}
                            className="checkbox checkbox-primary checkbox-sm rounded-full"
                          />
                        </td>
                        <td className="border p-2">{donation.controlNumber}</td>
                        <td className="border p-2">
                          {donation.donationStatus}
                        </td>
                        <td className="border p-2">
                          {donation.donor?.name || "Anonymous"}
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => {
                              setSelectedDonation(donation);
                              setIsViewingItems(true);
                            }}
                            className="btn btn-ghost btn-sm"
                          >
                            <FaEye className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="border p-4 text-center text-gray-500"
                      >
                        No donations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {selectedDonations.length > 0 && isUpdateModalOpen && (
          <UpdateStatusModal
            donationIds={selectedDonations}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedDonations([]);
            }}
            onUpdateStatus={handleBulkUpdateStatus}
          />
        )}
        {selectedDonation && isViewingItems && (
          <ViewItemsModal
            donation={selectedDonation}
            onClose={() => setSelectedDonation(null)}
          />
        )}
      </div>
    </div>
  );
}

function ViewItemsModal({
  donation,
  onClose,
}: {
  donation: Donation;
  onClose: () => void;
}) {
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4 bg-primary text-white p-5">
          Donation Items: {donation.controlNumber}
        </h2>
        <div className="p-5">
          {donation.donationItems && donation.donationItems.length > 0 ? (
            <ul className="list-disc list-inside">
              {donation.donationItems.map((item, index) => (
                <li key={index}>
                  {item.itemName}: {item.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items found for this donation.</p>
          )}
          <div className="modal-action">
            <button onClick={onClose} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}

function UpdateStatusModal({
  donationIds,
  onClose,
  onUpdateStatus,
}: {
  donationIds: number[];
  onClose: () => void;
  onUpdateStatus: (newStatus: string, remarks: string) => void;
}) {
  const [status, setStatus] = useState("PLEDGED");
  const [remarks, setRemarks] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSubmit = async () => {
    try {
      setIsConfirming(true);
      await onUpdateStatus(status, remarks);
      setUpdateResult({
        success: true,
        message: `Successfully updated ${donationIds.length} donation(s)!`,
      });
    } catch (error) {
      setUpdateResult({
        success: false,
        message: "Failed to update donations. Please try again.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4 bg-primary text-white p-5">
          Update Status: {donationIds.length} Donations
        </h2>
        <div className="p-5">
          {updateResult && (
            <div
              className={`alert ${
                updateResult.success ? "alert-success" : "alert-error"
              } mb-4`}
            >
              <span>{updateResult.message}</span>
            </div>
          )}

          <div className={updateResult ? "hidden" : ""}>
            <p className="mb-2 font-semibold">Current Status: {status}</p>
            <div className="mt-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select select-primary select-bordered w-full mb-2"
                disabled={isConfirming}
              >
                <option value="PLEDGED">Pledged</option>
                <option value="COLLECTED">Collected</option>
                <option value="PROCESSING">Processing</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="RECEIVED">Received</option>
              </select>
              <input
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="input input-primary input-bordered w-full"
                disabled={isConfirming}
              />
            </div>
          </div>

          <div className="modal-action">
            {updateResult ? (
              <button onClick={onClose} className="btn btn-primary text-white">
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary text-white"
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Update Status"
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="btn"
                  disabled={isConfirming}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
