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
  batchNumber?: string;
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

  const handleSelectAllForPost = (postId: string, select: boolean) => {
    const donationIds = posts
      .find(p => p.id === postId)
      ?.donations
      .filter(d => d.donationStatus !== "RECEIVED")
      .map(d => d.id) || [];
    
    setSelectedDonations(prev => 
      select 
        ? Array.from(new Set([...prev, ...donationIds]))
        : prev.filter(id => !donationIds.includes(id))
    );
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
        {posts.map((post: BarangayRequestPost) => (
          <div
            key={post.id}
            className="mb-8 border rounded shadow overflow-hidden"
          >
            <div className="bg-primary text-white p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <h2 className="text-lg md:text-xl font-semibold">
                  Post: {post.id.slice(-10)}...
                </h2>
                <p>{new Date(post.dateTime).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-5 mb-5 bg-gray-50 rounded shadow-md">
                <div>
                  <span className="font-semibold block">Contact Person:</span>
                  <span>{post.person || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold block">Contact Number:</span>
                  <span>{post.contactNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold block">Area:</span>
                  <span>{post.area || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold block">Type of Calamity:</span>
                  <span>{post.typeOfCalamity || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold block">Batch:</span>
                  <span>{post.batchNumber || "N/A"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const hasAllSelected = post.donations
                      .filter(d => d.donationStatus !== "RECEIVED")
                      .every(d => selectedDonations.includes(d.id));
                    handleSelectAllForPost(post.id, !hasAllSelected);
                    setIsUpdateModalOpen(false);
                    setIsViewingItems(false);
                    setSelectedDonation(null);
                  }}
                  className={`btn btn-sm ${
                    post.donations.filter(d => d.donationStatus !== "RECEIVED").every(d => selectedDonations.includes(d.id))
                      ? "btn-error text-white"  // Alert color when all selected
                      : "btn-primary text-white" // Primary color when not all selected
                  }`}
                  disabled={post.donations.every(d => d.donationStatus === "RECEIVED")}
                >
                  {post.donations.filter(d => d.donationStatus !== "RECEIVED").every(d => selectedDonations.includes(d.id))
                    ? "Deselect All"
                    : "Select All"}
                </button>
                
                {selectedDonations.some(id => 
                  post.donations.some(d => d.id === id)
                ) && (
                  <button
                    onClick={() => {
                      setSelectedDonation(null);
                      setIsViewingItems(false);
                      setIsUpdateModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm text-white"
                  >
                    Update Selected ({
                      selectedDonations.filter(id => 
                        post.donations.some(d => d.id === id)
                      ).length
                    })
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                {/* For mobile screens */}
                <div className="md:hidden">
                  {post.donations.length > 0 ? (
                    post.donations.map((donation) => (
                      <div key={donation.id} className="mb-4 border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="checkbox"
                            checked={selectedDonations.includes(donation.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              setSelectedDonations(prev =>
                                e.target.checked
                                  ? [...prev, donation.id]
                                  : prev.filter((id) => id !== donation.id)
                              );
                              setIsUpdateModalOpen(false);
                              setIsViewingItems(false);
                              setSelectedDonation(null);
                            }}
                            className="checkbox checkbox-primary checkbox-sm rounded-full"
                            disabled={donation.donationStatus === "RECEIVED"}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDonation(donation);
                              setIsViewingItems(true);
                              setIsUpdateModalOpen(false);
                            }}
                            className="btn btn-ghost btn-sm"
                          >
                            <FaEye className="text-lg" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <p><span className="font-semibold">Control Number:</span> {donation.controlNumber}</p>
                          <p><span className="font-semibold">Status:</span> {donation.donationStatus}</p>
                          <p><span className="font-semibold">Donor:</span> {donation.donor?.name || "Anonymous"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No donations found
                    </div>
                  )}
                </div>

                {/* For desktop screens */}
                <table className="w-full border-collapse hidden md:table">
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
                                e.stopPropagation();
                                setSelectedDonations(prev =>
                                  e.target.checked
                                    ? [...prev, donation.id]
                                    : prev.filter((id) => id !== donation.id)
                                );
                                setIsUpdateModalOpen(false);
                                setIsViewingItems(false);
                                setSelectedDonation(null);
                              }}
                              className="checkbox checkbox-primary checkbox-sm rounded-full"
                              disabled={donation.donationStatus === "RECEIVED"}
                            />
                          </td>
                          <td className="border p-2">
                            {donation.controlNumber}
                          </td>
                          <td className="border p-2">
                            {donation.donationStatus}
                          </td>
                          <td className="border p-2">
                            {donation.donor?.name || "Anonymous"}
                          </td>
                          <td className="border p-2 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDonation(donation);
                                setIsViewingItems(true);
                                setIsUpdateModalOpen(false);
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
            posts={posts}
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
      <div className="modal-box w-11/12 max-w-xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold mb-4 bg-primary text-white p-3 md:p-5 rounded-t">
          Donation Items: {donation.controlNumber}
        </h2>
        <div className="p-3 md:p-5">
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
  posts,
}: {
  donationIds: number[];
  onClose: () => void;
  onUpdateStatus: (newStatus: string, remarks: string) => void;
  posts: BarangayRequestPost[];
}) {
  // Add status sequence definition
  const statusSequence = {
    PLEDGED: ["COLLECTED"],
    COLLECTED: ["PROCESSING"],
    PROCESSING: ["IN_TRANSIT"],
    IN_TRANSIT: ["RECEIVED"],
    RECEIVED: [],
  };

  // Get current status of selected donations from posts state
  const [currentStatus, setCurrentStatus] = useState(() => {
    const firstDonation = posts.flatMap((post: BarangayRequestPost) => 
      post.donations.filter((d: Donation) => donationIds.includes(d.id))
    )[0];
    return firstDonation?.donationStatus || "PLEDGED";
  });

  const [status, setStatus] = useState(() => {
    // Set initial status to the first available next status
    return statusSequence[currentStatus as keyof typeof statusSequence][0] || currentStatus;
  });
  const [remarks, setRemarks] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Get available next statuses
  const availableStatuses = statusSequence[currentStatus as keyof typeof statusSequence];

  const handleSubmit = async () => {
    // Validate status transition
    if (!availableStatuses.includes(status as never)) {
      setUpdateResult({
        success: false,
        message: "Invalid status transition. Please select a valid next status.",
      });
      return;
    }

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
      console.error("Error updating donation statuses:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold mb-4 bg-primary text-white p-3 md:p-5 rounded-t">
          Update Status: {donationIds.length} Donations
        </h2>
        <div className="p-3 md:p-5">
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
            <p className="mb-2 font-semibold">Current Status: {currentStatus}</p>
            <div className="mt-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select select-primary select-bordered w-full mb-2"
                disabled={isConfirming || availableStatuses.length === 0}
              >
                {availableStatuses.length > 0 ? (
                  availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))
                ) : (
                  <option value={currentStatus}>No further status available</option>
                )}
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
