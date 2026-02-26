import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiSearch } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Mock dispute data
interface Dispute {
  id: number;
  disputeId: string;
  userName: string;
  userEmail: string;
  bookingFor: string;
  invoiceId: string;
  reason: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

const mockDisputes: Dispute[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  disputeId: `DIS${1000 + i}`,
  userName: `User ${i + 1}`,
  userEmail: `user${i + 1}@gmail.com`,
  bookingFor: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill Co.",
  invoiceId: `INV${1000 + i}`,
  reason: i % 2 === 0 ? "Double charge" : "Service not delivered",
  amount: Math.floor(Math.random() * 5000) + 100,
  status: ["Pending", "Approved", "Rejected"][i % 3] as
    | "Pending"
    | "Approved"
    | "Rejected",
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
}));

export default function SupportDisputes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredDisputes = useMemo(() => {
    return mockDisputes.filter((d) => {
      const matchesSearch = `${d.disputeId} ${d.userName} ${d.userEmail} ${d.invoiceId}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = filterStatus === "All" || d.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  return (
    <div>
      <PageMeta title="Dispute Management" description="Manage user disputes" />
      <PageBreadcrumb pageTitle="Dispute Management" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Dispute Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and manage all user disputes
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search disputes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700 text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Dispute ID</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Booking For</th>
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.length > 0 ? (
                filteredDisputes.map((d, idx) => (
                  <tr
                    key={d.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">{idx + 1}</td>
                    <td className="px-4 py-4 font-medium">{d.disputeId}</td>
                    <td className="px-4 py-4">{d.userName}</td>
                    <td className="px-4 py-4">{d.userEmail}</td>
                    <td className="px-4 py-4">{d.bookingFor}</td>
                    <td className="px-4 py-4">{d.invoiceId}</td>
                    <td className="px-4 py-4">${d.amount.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          d.status === "Approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : d.status === "Rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => navigate(`/support/disputes/view/${d.id}`)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400">
                    No disputes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
