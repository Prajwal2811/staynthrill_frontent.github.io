import { useState, useMemo } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Mock Commission Data (based on bookings)
interface Commission {
  id: number;
  bookingId: string;
  vendorName: string;
  vendorEmail: string;
  bookingAmount: number;
  commissionAmount: number;
  date: string;
  type: "Hotel" | "Adventure";
}

const mockCommissions: Commission[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  bookingId: `BKG${1000 + i}`,
  vendorName: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill",
  vendorEmail: i % 2 === 0 ? "hotel@sunshine.com" : "adventure@thrillco.com",
  bookingAmount: Math.floor(Math.random() * 5000) + 100,
  commissionAmount: Math.floor(Math.random() * 500) + 50,
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  type: i % 2 === 0 ? "Hotel" : "Adventure",
}));

export default function CommissionReports() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return mockCommissions.filter((c) => {
      const matchesSearch = `${c.bookingId} ${c.vendorName}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "All" || c.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [search, filterType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalBookingAmount = filteredData.reduce((acc, curr) => acc + curr.bookingAmount, 0);
  const totalCommissionAmount = filteredData.reduce((acc, curr) => acc + curr.commissionAmount, 0);

  const handleDownload = () => {
    alert("Download CSV / PDF functionality to implement!");
  };

  return (
    <div>
      <PageMeta title="Commission Reports" description="View and export platform commission records" />
      <PageBreadcrumb pageTitle="Commission Reports" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Commission Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View all commissions earned from bookings
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking/vendor..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Type Filter */}
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
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Booking Amount</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((c, index) => (
                  <tr
                    key={c.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-4 font-medium">{c.bookingId}</td>
                    <td className="px-4 py-4">{c.vendorName}</td>
                    <td className="px-4 py-4">${c.bookingAmount.toFixed(2)}</td>
                    <td className="px-4 py-4">${c.commissionAmount.toFixed(2)}</td>
                    <td className="px-4 py-4">{c.type}</td>
                    <td className="px-4 py-4">{c.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>

            {/* Totals */}
            {paginatedData.length > 0 && (
              <tfoot>
                <tr className="border-t dark:border-gray-700 font-semibold text-gray-700 dark:text-white">
                  <td colSpan={3} className="px-4 py-3 text-right">
                    Total
                  </td>
                  <td className="px-4 py-3">${totalBookingAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">${totalCommissionAmount.toFixed(2)}</td>
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
