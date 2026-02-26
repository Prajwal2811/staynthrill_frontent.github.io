import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiSearch, FiPlus } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Commission {
  id: number;
  commissionId: string;
  userName: string;
  email: string;
  amount: number;
  date: string;
  type: "Sale" | "Referral" | "Bonus";
  status: "Paid" | "Pending" | "Cancelled";
}

interface Vendor {
  id: number;
  name: string;
  email: string;
}

export default function FinanceCommissions() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Commission>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const itemsPerPage = 10;

  const vendors: Vendor[] = [
    { id: 1, name: "Hotel Sunshine", email: "sunshine@vendor.com" },
    { id: 2, name: "Adventure Thrill Co.", email: "thrill@vendor.com" },
    { id: 3, name: "Cozy Cottage", email: "cozy@vendor.com" },
  ];

  const [commissions, setCommissions] = useState<Commission[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      commissionId: `COM${1000 + index}`,
      userName: `User ${index + 1}`,
      email: `user${index + 1}@gmail.com`,
      amount: Math.floor(Math.random() * 2000) + 50,
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      )
        .toISOString()
        .split("T")[0],
      type: ["Sale", "Referral", "Bonus"][index % 3] as
        | "Sale"
        | "Referral"
        | "Bonus",
      status: ["Paid", "Pending", "Cancelled"][index % 3] as
        | "Paid"
        | "Pending"
        | "Cancelled",
    }))
  );

  const [newCommission, setNewCommission] = useState<
    Omit<Commission, "id" | "commissionId">
  >({
    userName: "",
    email: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    type: "Sale",
    status: "Pending",
  });

  const handleSort = (field: keyof Commission) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredCommissions = useMemo(() => {
    let data = commissions.filter((c) => {
      const matchesSearch = `${c.commissionId} ${c.userName} ${c.email}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || c.status === filterStatus;

      const matchesType =
        filterType === "All" || c.type === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });

    data.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (sortField === "date") {
        valueA = new Date(a.date).getTime() as any;
        valueB = new Date(b.date).getTime() as any;
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [commissions, search, sortField, sortOrder, filterStatus, filterType]);

  const totalPages = Math.ceil(
    filteredCommissions.length / itemsPerPage
  );

  const paginatedCommissions = filteredCommissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddCommission = () => {
    if (
      !newCommission.userName ||
      !newCommission.email ||
      newCommission.amount <= 0
    ) {
      alert("Please fill all required fields");
      return;
    }

    const nextId = commissions.length + 1;

    const newEntry: Commission = {
      id: nextId,
      commissionId: `COM${1000 + nextId}`,
      ...newCommission,
    };

    setCommissions([newEntry, ...commissions]);
    setShowAddModal(false);

    setNewCommission({
      userName: "",
      email: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      type: "Sale",
      status: "Pending",
    });
  };

  return (
    <div>
      <PageMeta
        title="Commission Settings"
        description="Manage platform commission settings and payouts"
      />
      <PageBreadcrumb pageTitle="Commission Settings" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Commission Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and manage all vendor commissions
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search commissions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800"
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
              <option value="Sale">Sale</option>
              <option value="Referral">Referral</option>
              <option value="Bonus">Bonus</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              <FiPlus />
              Add Commission
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700 text-gray-500 uppercase text-xs">
                <th className="px-4 py-3">#</th>
                <th onClick={() => handleSort("commissionId")} className="px-4 py-3 cursor-pointer">Commission ID</th>
                <th onClick={() => handleSort("userName")} className="px-4 py-3 cursor-pointer">Vendor Name</th>
                <th className="px-4 py-3">Email</th>
                <th onClick={() => handleSort("amount")} className="px-4 py-3 cursor-pointer">Amount</th>
                <th onClick={() => handleSort("date")} className="px-4 py-3 cursor-pointer">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCommissions.map((c, index) => (
                <tr key={c.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-4 font-medium">{c.commissionId}</td>
                  <td className="px-4 py-4">{c.userName}</td>
                  <td className="px-4 py-4">{c.email}</td>
                  <td className="px-4 py-4">${c.amount.toFixed(2)}</td>
                  <td className="px-4 py-4">{c.date}</td>
                  <td className="px-4 py-4">{c.type}</td>
                  <td className="px-4 py-4">{c.status}</td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => navigate(`/finance/commissions/view/${c.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEye size={18} />
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
                  : "border"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Add Commission
            </h3>

            <div className="flex flex-col gap-3">
              <select
                value={newCommission.userName}
                onChange={(e) => {
                  const vendor = vendors.find((v) => v.name === e.target.value);
                  setNewCommission({
                    ...newCommission,
                    userName: vendor?.name || "",
                    email: vendor?.email || "",
                  });
                }}
                className="border rounded-lg px-3 py-2 dark:bg-gray-800"
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.email})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={newCommission.amount}
                onChange={(e) =>
                  setNewCommission({
                    ...newCommission,
                    amount: Number(e.target.value),
                  })
                }
                className="border rounded-lg px-3 py-2 dark:bg-gray-800"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCommission}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
