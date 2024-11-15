import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

interface Request {
  id: number;
  completeName: string;
  area: string;
  typeOfCalamity: string;
  dateTime: string;
  inKindNecessities: string;
  specifications: string;
}

const calamityTypes = [
  "All",
  "Flood",
  "Earthquake",
  "Tropical Disease",
  "Drought",
  "Dengue Fever",
  "Water Shortage",
  "Heatwave",
  "Tsunami",
  "Leptospirosis",
  "Volcanic Eruption",
  "Landslide",
  "Typhoon",
  "Fire",
];

interface CombinedData {
  areas: string[];
  calamityTypes: string[];
  necessities?: Record<string, string[]>;
  specifications?: Record<string, string[]>;
}

interface ParsedData {
  [key: string]: string | string[];
}

const DonationRequestsTable = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calamityType, setCalamityType] = useState("");
  const itemsPerPage = 10;
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isPostButtonEnabled, setIsPostButtonEnabled] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        let url = `/api/donation-requests?page=${currentPage}&limit=${itemsPerPage}`;

        // Add filters to the API call
        if (startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        if (calamityType && calamityType !== "All") {
          url += `&calamityType=${calamityType}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error fetching requests: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Sort the requests by date in descending order (newest first)
        const sortedRequests = (responseData.requests || []).sort(
          (a: Request, b: Request) =>
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );

        setRequests(sortedRequests);
        setTotalPages(responseData.totalPages || 0);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage, startDate, endDate, calamityType]);

  useEffect(() => {
    setIsPostButtonEnabled(selectedRequests.length > 0);
  }, [selectedRequests]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectAll = () => {
    if (selectedRequests.length > 0) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map((request: Request) => request.id));
    }
  };

  const handleSelectRequest = (id: number) => {
    setSelectedRequests((prev) =>
      prev.includes(id)
        ? prev.filter((requestId) => requestId !== id)
        : [...prev, id]
    );
  };

  const hasSelectedRequests = selectedRequests.length > 0;

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handlePostClick = () => {
    const selectedData = requests.filter((request: Request) =>
      selectedRequests.includes(request.id)
    );

    const combinedData = selectedData.reduce(
      (acc: CombinedData, request: Request) => {
        acc.areas = Array.from(new Set([...acc.areas, request.area]));

        acc.calamityTypes = Array.from(
          new Set([...acc.calamityTypes, request.typeOfCalamity])
        );

        let necessities, specifications;
        try {
          try {
            necessities = JSON.parse(
              request.inKindNecessities.replace(/'/g, '"')
            );
          } catch {
            necessities = request.inKindNecessities
              .split(",")
              .reduce((acc: Record<string, string>, item: string) => {
                const [key, value] = item.split(":").map((s) => s.trim());
                acc[key] = value;
                return acc;
              }, {});
          }

          try {
            specifications = JSON.parse(
              request.specifications.replace(/'/g, '"')
            );
          } catch {
            specifications = request.specifications
              .split(",")
              .reduce((acc: Record<string, string>, item: string) => {
                const [key, value] = item.split(":").map((s) => s.trim());
                acc[key] = value;
                return acc;
              }, {});
          }
        } catch (error) {
          console.error("Error parsing data for request:", request.id, error);
          necessities = {};
          specifications = {};
        }

        // Combine necessities
        Object.entries(necessities).forEach(([category, items]) => {
          if (!acc.necessities) acc.necessities = {};
          if (!acc.necessities[category]) acc.necessities[category] = [];
          if (Array.isArray(items)) {
            items.forEach((item) => acc.necessities![category].push(item));
          } else {
            acc.necessities![category].push(items as string);
          }
        });

        // Combine specifications
        Object.entries(specifications).forEach(([category, spec]) => {
          if (!acc.specifications) acc.specifications = {};
          if (!acc.specifications[category]) acc.specifications[category] = [];
          acc.specifications[category].push(spec as string);
        });

        return acc;
      },
      { areas: [], calamityTypes: [] }
    );

    // Convert Sets to Arrays
    if (combinedData.necessities) {
      Object.keys(combinedData.necessities).forEach((category: string) => {
        combinedData.necessities![category] = Array.from(
          combinedData.necessities![category]
        );
      });
    }
    if (combinedData.specifications) {
      Object.keys(combinedData.specifications).forEach((category: string) => {
        combinedData.specifications![category] = Array.from(
          combinedData.specifications![category]
        );
      });
    }

    console.log("Combined data:", combinedData);

    const queryParams = new URLSearchParams({
      areas: combinedData.areas.join(","),
      calamityTypes: combinedData.calamityTypes.join(","),
      necessities: JSON.stringify(combinedData.necessities || {}),
      specifications: JSON.stringify(combinedData.specifications || {}),
    });

    router.push(`/admin/admin-request-donation?${queryParams.toString()}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full bg-white shadow rounded-b-lg rounded-t-none">
        <thead>
          <tr>
            <th colSpan={7} className="p-4 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center">
                    <span className="mr-2 whitespace-nowrap text-sm">
                      Start Date:
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input input-primary input-sm p-1 border rounded text-sm w-32"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 whitespace-nowrap text-sm">
                      End Date:
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input input-primary input-sm p-1 border rounded text-sm w-32"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 whitespace-nowrap text-sm">
                      Calamity Type:
                    </span>
                    <select
                      value={calamityType}
                      onChange={(e) => setCalamityType(e.target.value)}
                      className="select select-primary select-sm p-1 border rounded text-sm w-40"
                    >
                      {calamityTypes.map((type) => (
                        <option key={type} value={type === "All" ? "" : type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handlePostClick}
                    disabled={!isPostButtonEnabled}
                    className={`btn btn-primary text-white ${
                      !isPostButtonEnabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </th>
          </tr>
          <tr className="bg-gray-50">
            <th className="p-3 text-black border-b">Name</th>
            <th className="p-3 text-black border-b">Area</th>
            <th className="p-3 text-black border-b">Calamity Type</th>
            <th className="p-3 text-black border-b">Necessities</th>
            <th className="p-3 text-black border-b">Date</th>
            <th className="p-3 text-black border-b w-40"></th>
            <th className="p-3 text-black border-b w-40">
              <div className="flex justify-center">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 rounded w-32 text-white"
                  style={{
                    backgroundColor: hasSelectedRequests
                      ? "#EF4444"
                      : "#10B981",
                    transition: "background-color 0.3s",
                  }}
                >
                  {hasSelectedRequests ? "Deselect All" : "Select All"}
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : requests.length > 0 ? (
            requests.map((request: Request) => (
              <tr
                key={request.id}
                className={`hover:bg-gray-50 ${
                  selectedRequests.includes(request.id) ? "bg-green-100" : ""
                }`}
              >
                <td className="p-3 border-b">{request.completeName}</td>
                <td className="p-3 border-b">{request.area}</td>
                <td className="p-3 border-b">{request.typeOfCalamity}</td>
                <td className="p-3 border-b">
                  {request.inKindNecessities &&
                  typeof request.inKindNecessities === "string"
                    ? request.inKindNecessities
                    : "No necessities specified"}
                </td>
                <td className="p-3 border-b">
                  {new Date(request.dateTime).toLocaleDateString()}
                </td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="btn btn-sm btn-primary text-white"
                  >
                    View
                  </button>
                </td>
                <td className="p-3 border-b w-40">
                  <div className="flex items-center justify-center">
                    <label className="flex items-center justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ease-in-out ${
                          selectedRequests.includes(request.id)
                            ? "bg-primary border-primary"
                            : "border-base-300"
                        }`}
                      >
                        {selectedRequests.includes(request.id) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7} className="p-4">
              <div className="flex justify-center items-center join">
                {Array.from({ length: totalPages }, (_, index: number) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`join-item btn btn-sm btn-square mx-1 ${
                      currentPage === index + 1
                        ? "btn-primary btn-active text-white"
                        : "btn-primary text-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {isModalOpen && selectedRequest && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center bg-primary text-white p-5">
              <h3 className="font-bold text-xl">Request Details</h3>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost text-white"
              >
                <IoClose className="h-6 w-6" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {selectedRequest.completeName}
              </p>
              <p>
                <span className="font-semibold">Area:</span>{" "}
                {selectedRequest.area}
              </p>
              <p>
                <span className="font-semibold">Calamity Type:</span>{" "}
                {selectedRequest.typeOfCalamity}
              </p>
              <div>
                <span className="font-semibold">In-Kind Necessities:</span>
                {(() => {
                  try {
                    // Parse the in-kind necessities as a comma-separated string
                    const necessities = selectedRequest.inKindNecessities
                      .split(",")
                      .map((item) => item.trim());
                    // Parse the specifications as a JSON object
                    const specifications = JSON.parse(
                      selectedRequest.specifications
                    );

                    return necessities.map((category) => (
                      <div key={category} className="ml-4 mt-2">
                        <strong>{category}:</strong>
                        <span className="ml-2">
                          {specifications[category] || "Nothing specified"}
                        </span>
                      </div>
                    ));
                  } catch (error) {
                    console.error("Error parsing data:", error);
                    return (
                      <div className="ml-4 mt-2">
                        <p>
                          Raw Necessities: {selectedRequest.inKindNecessities}
                        </p>
                        <p>
                          Raw Specifications: {selectedRequest.specifications}
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selectedRequest.dateTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default DonationRequestsTable;
