const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const DonationsTable = ({ donations }: { donations: any[] }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Donations</h2>
      {donations && donations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Control Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation: any) => (
                <tr key={donation.id} className="hover border-b">
                  <td className="px-4 py-2">{donation.controlNumber}</td>
                  <td className="px-4 py-2">{donation.donationStatus}</td>
                  <td className="px-4 py-2">
                    {dateFormatter.format(new Date(donation.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No donations found.</p>
      )}
    </>
  );
};

export default DonationsTable;
