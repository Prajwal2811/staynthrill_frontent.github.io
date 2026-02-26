import { useState, useMemo } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Mock Revenue Data (replace with API in production)
interface Revenue {
  id: number;
  bookingId: string;
  userName: string;
  userEmail: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  commission: number;
  date: string;
  type: "Hotel" | "Adventure";
}

const mockRevenue: Revenue[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  bookingId: `BKG${1000 + i}`,
  userName: `User ${i + 1}`,
  userEmail: `user${i + 1}@gmail.com`,
  vendorName: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill",
  vendorEmail: i % 2 === 0 ? "hotel@sunshine.com" : "adventure@thrillco.com",
  amount: Math.floor(Math.random() * 5000) + 100,
  commission: Math.floor(Math.random() * 500) + 50,
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  type: i % 2 === 0 ? "Hotel" : "Adventure",
}));

export default function RevenueReports() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return mockRevenue.filter((r) => {
      const matchesSearch = `${r.bookingId} ${r.userName} ${r.vendorName}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = filterType === "All" || r.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [search, filterType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCommission = filteredData.reduce((acc, curr) => acc + curr.commission, 0);

  const handleDownload = () => {
    // Implement CSV or PDF export
    alert("Download CSV / PDF functionality to implement!");
  };

  return (
    <div>
      <PageMeta title="Revenue Reports" description="View and export revenue reports" />
      <PageBreadcrumb pageTitle="Revenue Reports" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Revenue Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View platform revenue for all stays and adventure bookings
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking, user, vendor..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            >
              <option value="All">All Types</option>
              <option value="Hotel">Hotel</option>
              <option value="Adventure">Adventure</option>
            </select>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FiDownload /> Download
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700 text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((r, index) => (
                  <tr
                    key={r.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-4 font-medium">{r.bookingId}</td>
                    <td className="px-4 py-4">{r.userName}</td>
                    <td className="px-4 py-4">{r.vendorName}</td>
                    <td className="px-4 py-4">${r.amount.toFixed(2)}</td>
                    <td className="px-4 py-4">${r.commission.toFixed(2)}</td>
                    <td className="px-4 py-4">{r.date}</td>
                    <td className="px-4 py-4">{r.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
            {/* Totals */}
            {paginatedData.length > 0 && (
              <tfoot>
                <tr className="border-t dark:border-gray-700 font-semibold text-gray-700 dark:text-white">
                  <td colSpan={4} className="px-4 py-3 text-right">
                    Total
                  </td>
                  <td className="px-4 py-3">${totalRevenue.toFixed(2)}</td>
                  <td className="px-4 py-3">${totalCommission.toFixed(2)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
