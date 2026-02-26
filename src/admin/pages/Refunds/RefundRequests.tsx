import { useState, useMemo } from "react";
import { FiSearch, FiCheck, FiX } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

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
  status: "Pending",
}));

export default function RefundRequests() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return mockRefunds.filter((r) =>
      `${r.bookingId} ${r.userName} ${r.vendorName} ${r.userEmail}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openConfirmation = (refund: RefundRequest, type: "approve" | "reject") => {
    setSelectedRefund(refund);
    setActionType(type);
  };

  const confirmAction = () => {
    if (!selectedRefund || !actionType) return;

    console.log(
      `Refund ${selectedRefund.bookingId} ${actionType === "approve" ? "Approved" : "Rejected"}`
    );

    // 🔹 Here you call your API

    setSelectedRefund(null);
    setActionType(null);
  };

  return (
    <div>
      <PageMeta title="Refund Requests" description="View and manage pending refund requests" />
      <PageBreadcrumb pageTitle="Refund Requests" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Refund Requests</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review and take action on pending refund requests
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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((r, index) => (
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
                  <td className="px-4 py-4 flex gap-2">
                    <button
                      onClick={() => openConfirmation(r, "approve")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      onClick={() => openConfirmation(r, "reject")}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
                    >
                      <FiX /> Reject
                    </button>
                  </td>
                </tr>
              ))}
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

      {/* Confirmation Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Booking ID: <span className="font-medium">{selectedRefund.bookingId}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Amount: <span className="font-medium">${selectedRefund.amount.toFixed(2)}</span>
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {actionType === "approve" ? "approve" : "reject"}
              </span>{" "}
              this refund request?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedRefund(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}