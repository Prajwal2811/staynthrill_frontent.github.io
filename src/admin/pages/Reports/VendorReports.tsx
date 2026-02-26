import { useState, useMemo } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Mock Vendor Performance Data
interface VendorPerformance {
  id: number;
  vendorName: string;
  vendorEmail: string;
  type: "Hotel" | "Adventure";
  totalBookings: number;
  totalRevenue: number;
  totalCommission: number;
}

const mockVendors: VendorPerformance[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  vendorName: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill",
  vendorEmail: i % 2 === 0 ? "hotel@sunshine.com" : "adventure@thrillco.com",
  type: i % 2 === 0 ? "Hotel" : "Adventure",
  totalBookings: Math.floor(Math.random() * 50) + 10,
  totalRevenue: Math.floor(Math.random() * 50000) + 5000,
  totalCommission: Math.floor(Math.random() * 5000) + 500,
}));

export default function VendorReports() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return mockVendors.filter((v) => {
      const matchesSearch = v.vendorName.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "All" || v.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [search, filterType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalBookings = filteredData.reduce((acc, v) => acc + v.totalBookings, 0);
  const totalRevenue = filteredData.reduce((acc, v) => acc + v.totalRevenue, 0);
  const totalCommission = filteredData.reduce((acc, v) => acc + v.totalCommission, 0);

  const handleDownload = () => {
    alert("Download CSV / PDF functionality to implement!");
  };

  return (
    <div>
      <PageMeta title="Vendor Performance Reports" description="View vendor performance metrics" />
      <PageBreadcrumb pageTitle="Vendor Performance Reports" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Vendor Performance Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track total bookings, revenue, and commission per vendor
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by vendor..."
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
                <th className="px-4 py-3">Vendor Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Total Bookings</th>
                <th className="px-4 py-3">Total Revenue</th>
                <th className="px-4 py-3">Total Commission</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((v, index) => (
                  <tr
                    key={v.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-4 font-medium">{v.vendorName}</td>
                    <td className="px-4 py-4">{v.vendorEmail}</td>
                    <td className="px-4 py-4">{v.type}</td>
                    <td className="px-4 py-4">{v.totalBookings}</td>
                    <td className="px-4 py-4">${v.totalRevenue.toFixed(2)}</td>
                    <td className="px-4 py-4">${v.totalCommission.toFixed(2)}</td>
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
                  <td colSpan={4} className="px-4 py-3 text-right">
                    Total
                  </td>
                  <td className="px-4 py-3">{totalBookings}</td>
                  <td className="px-4 py-3">${totalRevenue.toFixed(2)}</td>
                  <td className="px-4 py-3">${totalCommission.toFixed(2)}</td>
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
