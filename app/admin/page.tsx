"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  Chart,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  FaClipboardList,
  FaBell,
  FaChartBar,
  FaChartPie,
  FaChartLine,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

interface CalamityCount {
  typeOfCalamity: string;
  count: number;
}

interface CalamityImpact {
  calamityType: string;
  mostImpactedBarangay: {
    name: string;
    count: number;
  };
}

interface BarangayColors {
  [key: string]: string;
}

interface TimeFilter {
  type: "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate: Date;
}

interface BarangayCalamityData {
  barangayName: string;
  mostRequestedCalamity: {
    type: string;
    count: number;
  };
}

// Update the color generation function for in-kind items
const generateInKindColors = (
  data: Array<{
    calamityType: string;
    mostRequestedItem: string;
    count: number;
  }>
) => {
  const colors = [
    "rgba(255, 99, 132, 0.8)", // Red
    "rgba(54, 162, 235, 0.8)", // Blue
    "rgba(255, 206, 86, 0.8)", // Yellow
    "rgba(75, 192, 192, 0.8)", // Teal
    "rgba(153, 102, 255, 0.8)", // Purple
    "rgba(255, 159, 64, 0.8)", // Orange
    "rgba(255, 99, 204, 0.8)", // Pink
    "rgba(102, 178, 255, 0.8)", // Light Blue
    "rgba(153, 255, 153, 0.8)", // Light Green
    "rgba(255, 153, 255, 0.8)", // Light Purple
    "rgba(255, 178, 102, 0.8)", // Light Orange
    "rgba(153, 204, 255, 0.8)", // Sky Blue
  ];

  // Create a map of unique items to colors
  const uniqueItems = Array.from(
    new Set(data.map((item) => item.mostRequestedItem))
  );
  const colorMap = new Map();
  uniqueItems.forEach((item, i) => {
    colorMap.set(item, colors[i % colors.length]);
  });

  // Return colors based on the items
  return data.map((item) => colorMap.get(item.mostRequestedItem));
};

export default function AnalyticsPage() {
  const [calamityData, setCalamityData] = useState<CalamityCount[]>([]);
  const [calamityImpactData, setCalamityImpactData] = useState<
    CalamityImpact[]
  >([]);
  const [barangayCalamityData, setBarangayCalamityData] = useState<
    BarangayCalamityData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({
    type: "monthly",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });
  const [showBarModal, setShowBarModal] = useState(false);
  const [showHorizontalBarModal, setShowHorizontalBarModal] = useState(false);
  const [inKindByCalamityData, setInKindByCalamityData] = useState<
    Array<{
      calamityType: string;
      mostRequestedItem: string;
      count: number;
    }>
  >([]);
  const [showInKindModal, setShowInKindModal] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [newRequests, setNewRequests] = useState(0);

  const handleTimeFilterChange = (filterType: TimeFilter["type"]) => {
    const now = new Date();
    let startDate = new Date();
    const endDate = now;

    switch (filterType) {
      case "monthly": {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
      case "quarterly": {
        const currentQuarter = Math.floor(now.getMonth() / 4);
        startDate = new Date(now.getFullYear(), currentQuarter * 4, 1);
        break;
      }
      case "yearly": {
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      }
    }

    setTimeFilter({
      type: filterType,
      startDate,
      endDate,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/donation-requests?startDate=${timeFilter.startDate.toISOString()}&endDate=${timeFilter.endDate.toISOString()}`
        );
        const data = await response.json();
        setInKindByCalamityData(data.inKindByCalamityData || []);

        // Process data for first chart (existing code)
        const calamityCounts: { [key: string]: number } = {};
        data.requests.forEach((request: any) => {
          const type = request.typeOfCalamity;
          calamityCounts[type] = (calamityCounts[type] || 0) + 1;
        });

        const sortedData = Object.entries(calamityCounts)
          .map(([typeOfCalamity, count]) => ({ typeOfCalamity, count }))
          .sort((a, b) => b.count - a.count);

        setCalamityData(sortedData);

        // Process data for calamity impact chart
        const impactMap: { [key: string]: { [key: string]: number } } = {};

        data.allBarangaysData.forEach((item: any) => {
          const calamityType = item.typeOfCalamity;
          const barangayName = item.Barangay?.name || "Unknown";

          if (!impactMap[calamityType]) {
            impactMap[calamityType] = {};
          }
          impactMap[calamityType][barangayName] =
            (impactMap[calamityType][barangayName] || 0) + 1;
        });

        // Convert to array and find most impacted barangay for each calamity
        const impactData = Object.entries(impactMap).map(
          ([calamityType, barangayCounts]) => {
            const entries = Object.entries(barangayCounts);
            const mostImpacted = entries.reduce((max, current) =>
              current[1] > max[1] ? current : max
            );

            return {
              calamityType,
              mostImpactedBarangay: {
                name: mostImpacted[0],
                count: mostImpacted[1],
              },
            };
          }
        );

        setCalamityImpactData(impactData);
        setBarangayCalamityData(data.barangayCalamityData);
        setTotalRequests(data.totalRequests);
        setNewRequests(data.newRequestsCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFilter]);

  // Add this function inside the component to generate colors for barangays
  const generateBarangayColors = (data: CalamityImpact[]) => {
    const uniqueBarangays = Array.from(
      new Set(data.map((item) => item.mostImpactedBarangay.name))
    );
    const colors = [
      "#FF6384", // Pink
      "#36A2EB", // Blue
      "#FFCE56", // Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
      "#FF9F40", // Orange
      "#FF99CC", // Light Pink
      "#66B2FF", // Light Blue
      "#99FF99", // Light Green
      "#FF99FF", // Light Purple
      "#FFB366", // Light Orange
      "#99CCFF", // Sky Blue
    ];

    const barangayColors: BarangayColors = {};
    uniqueBarangays.forEach((barangay, index) => {
      barangayColors[barangay] = colors[index % colors.length];
    });
    return barangayColors;
  };

  // Update the bar chart data configuration
  const barChartData = {
    labels: calamityImpactData.map((item) => item.calamityType),
    datasets: [
      {
        label: "Number of Requests",
        data: calamityImpactData.map((item) => item.mostImpactedBarangay.count),
        backgroundColor: calamityImpactData.map(
          (item) =>
            generateBarangayColors(calamityImpactData)[
              item.mostImpactedBarangay.name
            ]
        ),
        borderWidth: 0,
        borderRadius: 6,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.2)",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Most Impacted Barangay by Calamity Type",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const calamityData = calamityImpactData[context.dataIndex];
            return `${calamityData.mostImpactedBarangay.name}: ${calamityData.mostImpactedBarangay.count} requests`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Calamity Type",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Requests",
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
        borderRadius: 6,
      },
    },
  };

  // Add a legend component below the chart
  const renderBarangayLegend = () => {
    const barangayColors = generateBarangayColors(calamityImpactData);
    return (
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {Object.entries(barangayColors).map(([barangay, color]) => (
          <div key={barangay} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm">{barangay}</span>
          </div>
        ))}
      </div>
    );
  };

  // Add this function to generate colors for calamity types
  const generateCalamityColors = (data: BarangayCalamityData[]) => {
    const uniqueCalamities = Array.from(
      new Set(data.map((item) => item.mostRequestedCalamity.type))
    );
    const colors = [
      "#FF6384", // Red
      "#36A2EB", // Blue
      "#FFCE56", // Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
      "#FF9F40", // Orange
      "#FF99CC", // Pink
      "#66B2FF", // Light Blue
      "#99FF99", // Light Green
      "#FF99FF", // Light Purple
      "#FFB366", // Light Orange
      "#99CCFF", // Sky Blue
      "#FF9999", // Light Red
    ];

    const colorMap = new Map();
    uniqueCalamities.forEach((calamity, index) => {
      colorMap.set(calamity, colors[index % colors.length]);
    });

    return colorMap;
  };

  // Update the horizontal bar chart data configuration
  const horizontalBarData = {
    labels: barangayCalamityData.map((item) => item.barangayName),
    datasets: [
      {
        label: "Number of Requests",
        data: barangayCalamityData.map(
          (item) => item.mostRequestedCalamity.count
        ),
        backgroundColor: barangayCalamityData.map((item) =>
          generateCalamityColors(barangayCalamityData).get(
            item.mostRequestedCalamity.type
          )
        ),
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const horizontalBarOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const calamityType =
              barangayCalamityData[dataIndex].mostRequestedCalamity.type;
            return `${calamityType}: ${context.formattedValue} requests`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Number of Requests",
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Update the renderCalamityLegend function
  const renderCalamityLegend = () => {
    const colorMap = generateCalamityColors(barangayCalamityData);
    return (
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {Array.from(colorMap.entries()).map(([calamityType, color]) => (
          <div key={calamityType} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-700">{calamityType}</span>
          </div>
        ))}
      </div>
    );
  };

  // Update the inKindBarData configuration to use consistent colors
  const inKindBarData = {
    labels: inKindByCalamityData?.map((item) => item.calamityType) || [],
    datasets: [
      {
        label: "Most Requested Items",
        data: inKindByCalamityData?.map((item) => item.count) || [],
        backgroundColor: generateInKindColors(inKindByCalamityData || []),
        borderColor: generateInKindColors(inKindByCalamityData || []).map(
          (color) => color.replace("0.8", "1") // Make border slightly darker
        ),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const inKindBarOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Most Requested In-Kind Necessities by Calamity Type",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const item = inKindByCalamityData[dataIndex];
            return `${item.mostRequestedItem}: ${item.count} requests`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Requests",
        },
      },
      x: {
        title: {
          display: true,
          text: "Calamity Type",
        },
      },
    },
  };

  // Update the render function for in-kind legend
  const renderInKindLegend = () => {
    // Get unique in-kind items and their colors
    const uniqueItems = Array.from(
      new Set(inKindByCalamityData.map((item) => item.mostRequestedItem))
    );

    const colorMap = new Map();
    uniqueItems.forEach((item, index) => {
      const color =
        generateInKindColors(inKindByCalamityData)[
          inKindByCalamityData.findIndex(
            (data) => data.mostRequestedItem === item
          )
        ];
      colorMap.set(item, color);
    });

    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {uniqueItems.map((item) => (
          <div key={item} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{
                backgroundColor: colorMap.get(item),
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/50 p-4 md:p-8">
      {/* Main dashboard content */}
      <div className="flex flex-col gap-4 md:gap-8">
        {/* Header with Dashboard title and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            Dashboard
          </h1>

          {/* Fixed width select container */}
          <div className="flex justify-center sm:justify-end w-full sm:w-auto">
            <div className="inline-flex bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl shadow-md p-1.5">
              <div className="flex justify-center gap-1">
                {["monthly", "quarterly", "yearly"].map((type) => (
                  <button
                    key={type}
                    className={`
                      px-3 md:px-5 py-2 text-sm font-medium rounded-xl whitespace-nowrap
                      transition-all duration-300 ease-in-out
                      ${
                        timeFilter.type === type
                          ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105"
                          : "text-gray-600 hover:bg-white/70"
                      }
                    `}
                    onClick={() =>
                      handleTimeFilterChange(type as TimeFilter["type"])
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats boxes moved below header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          {/* Total Requests Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300 border border-emerald-100/50 group">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-emerald-600 mb-1">
                  Total Requests
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
                    {totalRequests || 0}
                  </p>
                  <span className="text-xs text-emerald-600/70">all time</span>
                </div>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <FaClipboardList className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 bg-emerald-100/50 h-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* New Requests Box */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300 border border-blue-100/50 group">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-blue-600 mb-1">
                  New Requests
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                    {newRequests || 0}
                  </p>
                  <span className="text-xs text-blue-600/70">
                    last 24 hours
                  </span>
                </div>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <FaBell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 bg-blue-100/50 h-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{
                  width: `${(newRequests / totalRequests) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
          {/* In-Kind Chart Card */}
          <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => setShowInKindModal(true)}
          >
            <div className="card-body">
              <h2 className="card-title flex justify-between">
                Most Requested Items by Calamity
                <FaChartBar className="w-5 h-5 opacity-70" />
              </h2>
              <div className="h-[300px] w-full">
                <Bar
                  data={inKindBarData}
                  options={{
                    ...inKindBarOptions,
                    maintainAspectRatio: false,
                    plugins: {
                      ...inKindBarOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                  plugins={[
                    {
                      id: "shadowPlugin",
                      beforeDraw: (chart: any) => {
                        const { ctx } = chart;
                        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
                        ctx.shadowBlur = 15;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;
                      },
                    },
                  ]}
                />
              </div>
              <div className="mt-4 px-4 py-3 bg-base-200 rounded-xl">
                {renderInKindLegend()}
              </div>
            </div>
          </div>

          {/* Impact Chart Card */}
          <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => setShowBarModal(true)}
          >
            <div className="card-body">
              <h2 className="card-title flex justify-between">
                Impact by Barangay
                <FaChartPie className="w-5 h-5 opacity-70" />
              </h2>
              <div className="h-[300px] w-full">
                <Bar
                  data={barChartData}
                  options={{
                    ...barChartOptions,
                    maintainAspectRatio: false,
                    plugins: {
                      ...barChartOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                  plugins={[
                    {
                      id: "shadowPlugin",
                      beforeDraw: (chart: any) => {
                        const { ctx } = chart;
                        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
                        ctx.shadowBlur = 15;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;
                      },
                    },
                  ]}
                />
              </div>
              <div className="mt-4 px-4 py-3 bg-base-200 rounded-xl">
                {renderBarangayLegend()}
              </div>
            </div>
          </div>

          {/* Horizontal Bar Chart Card */}
          <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer xl:col-span-2"
            onClick={() => setShowHorizontalBarModal(true)}
          >
            <div className="card-body">
              <h2 className="card-title flex justify-between">
                Barangay Calamity Analysis
                <FaChartLine className="w-5 h-5 opacity-70" />
              </h2>
              <p className="text-sm opacity-70">
                Most requested calamity type per barangay
              </p>
              <div className="h-[400px] w-full">
                <Bar
                  data={horizontalBarData}
                  options={{
                    ...horizontalBarOptions,
                    maintainAspectRatio: false,
                    plugins: {
                      ...horizontalBarOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                  plugins={[
                    {
                      id: "shadowPlugin",
                      beforeDraw: (chart: any) => {
                        const { ctx } = chart;
                        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
                        ctx.shadowBlur = 15;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;
                      },
                    },
                  ]}
                />
              </div>
              <div className="mt-4 px-4 py-3 bg-base-200 rounded-xl">
                {renderCalamityLegend()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Bar Chart Modal */}
      <dialog
        id="bar_modal"
        className={`modal ${showBarModal ? "modal-open" : ""}`}
      >
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowBarModal(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 px-5 pt-5">Impact by Barangay Details</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="h-[400px] w-full">
                <Bar
                  data={barChartData}
                  options={{ ...barChartOptions, maintainAspectRatio: false }}
                />
              </div>
              <div className="mt-4 px-4 py-3 bg-base-200 rounded-xl w-full">
                {renderBarangayLegend()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Barangay</th>
                    <th>Most Impacted By</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {calamityImpactData.map((item) => (
                    <tr key={item.calamityType}>
                      <td>{item.mostImpactedBarangay.name}</td>
                      <td>{item.calamityType}</td>
                      <td>{item.mostImpactedBarangay.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowBarModal(false)}>close</button>
        </form>
      </dialog>

      {/* Horizontal Bar Chart Modal */}
      <dialog
        id="horizontal_bar_modal"
        className={`modal ${showHorizontalBarModal ? "modal-open" : ""}`}
      >
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowHorizontalBarModal(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 px-5 pt-5">
            Barangay Calamity Analysis Details
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="h-[400px] w-full">
                <Bar
                  data={horizontalBarData}
                  options={{
                    ...horizontalBarOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div className="mt-4 px-4 py-3 bg-base-200 rounded-xl w-full">
                {renderCalamityLegend()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Barangay</th>
                    <th>Most Requested Calamity</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {barangayCalamityData.map((item) => (
                    <tr key={item.barangayName}>
                      <td>{item.barangayName}</td>
                      <td>{item.mostRequestedCalamity.type}</td>
                      <td>{item.mostRequestedCalamity.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowHorizontalBarModal(false)}>
            close
          </button>
        </form>
      </dialog>

      {/* In-Kind Modal */}
      <dialog
        id="in_kind_modal"
        className={`modal ${showInKindModal ? "modal-open" : ""}`}
      >
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowInKindModal(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 px-5 pt-5">
            In-Kind Necessities Analysis
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="h-[400px] w-full">
                <Bar
                  data={inKindBarData}
                  options={{ ...inKindBarOptions, maintainAspectRatio: false }}
                />
              </div>
              <div className="mt-4 px-4 py-3 bg-base-200 rounded-xl w-full">
                {renderInKindLegend()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Calamity Type</th>
                    <th>Most Requested Item</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {inKindByCalamityData.map((item) => (
                    <tr key={item.calamityType}>
                      <td>{item.calamityType}</td>
                      <td>{item.mostRequestedItem}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowInKindModal(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
