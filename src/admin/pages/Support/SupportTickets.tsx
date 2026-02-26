import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEye } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Ticket {
  id: number;
  ticketId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: "Booking" | "Payment" | "Technical" | "Other";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
}

const mockTickets: Ticket[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  ticketId: `TICK${1000 + i}`,
  userName: `User ${i + 1}`,
  userEmail: `user${i + 1}@gmail.com`,
  subject: i % 2 === 0 ? "Issue with booking" : "Payment not processed",
  category: ["Booking", "Payment", "Technical", "Other"][i % 4] as
    | "Booking"
    | "Payment"
    | "Technical"
    | "Other",
  status: ["Open", "In Progress", "Resolved"][i % 3] as
    | "Open"
    | "In Progress"
    | "Resolved",
  createdAt: new Date(
    Date.now() - i * 86400000
  ).toISOString().split("T")[0],
}));

export default function SupportTickets() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter + Search
  const filteredTickets = useMemo(() => {
    return mockTickets.filter((t) => {
      const matchesSearch = `${t.ticketId} ${t.userName} ${t.userEmail} ${t.subject}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = filterStatus === "All" || t.status === filterStatus;
      const matchesCategory =
        filterCategory === "All" || t.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [search, filterStatus, filterCategory]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Support Tickets" description="Manage user support tickets" />
      <PageBreadcrumb pageTitle="Support Tickets" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Support Tickets
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and manage user support tickets
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Filter Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            >
              <option value="All">All Categories</option>
              <option value="Booking">Booking</option>
              <option value="Payment">Payment</option>
              <option value="Technical">Technical</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700 text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((t, index) => (
                  <tr
                    key={t.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-4 font-medium">{t.ticketId}</td>
                    <td className="px-4 py-4">{t.userName}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{t.userEmail}</td>
                    <td className="px-4 py-4">{t.subject}</td>
                    <td className="px-4 py-4">{t.category}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full transition ${
                          t.status === "Resolved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : t.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => navigate(`/support/tickets/view/${t.id}`)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No tickets found
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



// import React from 'react'

// const SupportTickets = () => {
//   return (
//     <div>SupportTickets</div>
//   )
// }

// export default SupportTickets
