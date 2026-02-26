import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Mock refund data
interface RefundRequest {
  id: number;
  bookingId: string;
  userName: string;
  userEmail: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  reason: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockRefunds: RefundRequest[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  bookingId: `BKG${1000 + i}`,
  userName: `User ${i + 1}`,
  userEmail: `user${i + 1}@gmail.com`,
  vendorName: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill",
  vendorEmail: i % 2 === 0 ? "hotel@sunshine.com" : "adventure@thrillco.com",
  amount: Math.floor(Math.random() * 5000) + 100,
  reason: i % 2 === 0 ? "Booking cancelled by user" : "Payment issue",
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  status: i % 3 === 1 ? "Approved" : i % 3 === 2 ? "Rejected" : "Pending", // some approved, some rejected, some pending
}));

export default function ApprovedRefunds() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter only approved refunds + search
  const filteredData = useMemo(() => {
    return mockRefunds
      .filter((r) => r.status === "Approved")
      .filter((r) =>
        `${r.bookingId} ${r.userName} ${r.vendorName} ${r.userEmail}`.toLowerCase().includes(search.toLowerCase())
      );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Approved Refunds" description="View all approved refund requests" />
      <PageBreadcrumb pageTitle="Approved Refunds" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Approved Refunds</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review all refund requests that have been approved
            </p>
          </div>

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
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
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
                    <td className="px-4 py-4">{r.reason}</td>
                    <td className="px-4 py-4">{r.date}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 rounded-lg bg-green-600 text-white text-sm">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No approved refund requests
                  </td>
                </tr>
              )}
            </tbody>
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
