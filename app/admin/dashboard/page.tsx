"use client";

import DonationRequestsTable from "@/components/admin/dashboard/DonationRequestsTable";

const AdminDashboard = () => {
  return (
    <div>
      <div className="hero-background bg-cover max-h-[30rem] sticky top-0 z-10">
        <div className="py-10 text-center backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white">
            Admin Dashboard
          </h1>
        </div>
      </div>
      <div className="m-5 outline outline-primary rounded-lg">
        <div className="bg-primary z-0">
          <h2 className="text-white text-xl font-bold p-5">
            Recipient Donation Requests for your Barangay
          </h2>
          <DonationRequestsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
