import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiSearch, FiPlus } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Payout {
  id: number;
  payoutId: string;
  vendorName: string;
  email: string;
  amount: number;
  date: string;
  type: "Commission" | "Bonus" | "Refund";
  status: "Paid" | "Pending" | "Cancelled";
}

interface Vendor {
  id: number;
  name: string;
  email: string;
}

export default function FinancePayouts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Payout>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  // Mock Vendors
  const vendors: Vendor[] = [
    { id: 1, name: "Hotel Sunshine", email: "sunshine@vendor.com" },
    { id: 2, name: "Adventure Thrill Co.", email: "thrill@vendor.com" },
    { id: 3, name: "Cozy Cottage", email: "cozy@vendor.com" },
  ];

  // Mock Payouts
  const [payouts, setPayouts] = useState<Payout[]>(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      payoutId: `PAY${1000 + i}`,
      vendorName: vendors[i % vendors.length].name,
      email: vendors[i % vendors.length].email,
      amount: Math.floor(Math.random() * 3000) + 100,
      date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      type: ["Commission", "Bonus", "Refund"][i % 3] as "Commission" | "Bonus" | "Refund",
      status: ["Paid", "Pending", "Cancelled"][i % 3] as "Paid" | "Pending" | "Cancelled",
    }))
  );

  // Add Payout form state
  const [newPayout, setNewPayout] = useState<Omit<Payout, "id" | "payoutId">>({
    vendorName: "",
    email: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    type: "Commission",
    status: "Pending",
  });

  // Sorting handler
  const handleSort = (field: keyof Payout) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter + Search + Sort
  const filteredPayouts = useMemo(() => {
    let data = payouts.filter((p) => {
      const matchesSearch = `${p.payoutId} ${p.vendorName} ${p.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = filterStatus === "All" || p.status === filterStatus;
      const matchesType = filterType === "All" || p.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });

    data.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [payouts, search, sortField, sortOrder, filterStatus, filterType]);

  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add Payout handler
  const handleAddPayout = () => {
    if (!newPayout.vendorName || newPayout.amount <= 0) {
      alert("Please select vendor and enter valid amount");
      return;
    }
    const nextId = payouts.length + 1;
    const newEntry: Payout = {
      id: nextId,
      payoutId: `PAY${1000 + nextId}`,
      ...newPayout,
    };
    setPayouts([newEntry, ...payouts]);
    setShowAddModal(false);
    setNewPayout({
      vendorName: "",
      email: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      type: "Commission",
      status: "Pending",
    });
  };

  return (
    <div>
      <PageMeta title="Finance Payouts" description="Manage all vendor payouts" />
      <PageBreadcrumb pageTitle="Finance Payouts" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Finance Payouts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and manage all vendor payouts, payments, and reports
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search payouts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            >
              <option value="All">All Types</option>
              <option value="Commission">Commission</option>
              <option value="Bonus">Bonus</option>
              <option value="Refund">Refund</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FiPlus />
              Add Payout
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700 text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">#</th>
                <th onClick={() => handleSort("payoutId")} className="px-4 py-3 cursor-pointer">
                  Payout ID
                </th>
                <th onClick={() => handleSort("vendorName")} className="px-4 py-3 cursor-pointer">
                  Vendor Name
                </th>
                <th onClick={() => handleSort("email")} className="px-4 py-3 cursor-pointer">
                  Email
                </th>
                <th onClick={() => handleSort("amount")} className="px-4 py-3 cursor-pointer">
                  Amount
                </th>
                <th onClick={() => handleSort("date")} className="px-4 py-3 cursor-pointer">
                  Date
                </th>
                <th onClick={() => handleSort("type")} className="px-4 py-3 cursor-pointer">
                  Type
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayouts.length > 0 ? (
                paginatedPayouts.map((p, index) => (
                  <tr key={p.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-4 font-medium">{p.payoutId}</td>
                    <td className="px-4 py-4">{p.vendorName}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{p.email}</td>
                    <td className="px-4 py-4">${p.amount.toFixed(2)}</td>
                    <td className="px-4 py-4">{p.date}</td>
                    <td className="px-4 py-4">{p.type}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full transition ${
                          p.status === "Paid"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : p.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => navigate(`/payouts/${p.id}`)}
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
                    No payouts found
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

      {/* Add Payout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Add Payout</h3>
            <div className="flex flex-col gap-3">
              {/* Vendor Selection */}
              <select
                value={newPayout.vendorName}
                onChange={(e) => {
                  const vendor = vendors.find((v) => v.name === e.target.value);
                  setNewPayout({
                    ...newPayout,
                    vendorName: vendor?.name || "",
                    email: vendor?.email || "",
                  });
                }}
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.email})
                  </option>
                ))}
              </select>

              {/* Email auto-filled */}
              <input
                type="email"
                placeholder="Email"
                value={newPayout.email}
                readOnly
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 bg-gray-100"
              />

              <input
                type="number"
                placeholder="Amount"
                value={newPayout.amount}
                onChange={(e) => setNewPayout({ ...newPayout, amount: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
              />
              <input
                type="date"
                value={newPayout.date}
                onChange={(e) => setNewPayout({ ...newPayout, date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
              />
              <select
                value={newPayout.type}
                onChange={(e) => setNewPayout({ ...newPayout, type: e.target.value as any })}
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
              >
                <option value="Commission">Commission</option>
                <option value="Bonus">Bonus</option>
                <option value="Refund">Refund</option>
              </select>
              <select
                value={newPayout.status}
                onChange={(e) => setNewPayout({ ...newPayout, status: e.target.value as any })}
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayout}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Add Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
