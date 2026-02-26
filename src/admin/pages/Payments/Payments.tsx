import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiSearch } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Payment {
  id: number;
  paymentId: string;
  userName: string;
  email: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
}

export default function PaymentHistory() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Payment>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;

  // Mock Data
  const [payments] = useState<Payment[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      paymentId: `PAY${1000 + index}`,
      userName: `User ${index + 1}`,
      email: `user${index + 1}@gmail.com`,
      amount: Math.floor(Math.random() * 5000) + 100,
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString().split("T")[0],
      status: ["Completed", "Pending", "Failed"][
        index % 3
      ] as "Completed" | "Pending" | "Failed",
    }))
  );

  // Sorting Handler
  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter + Sort
  const filteredPayments = useMemo(() => {
    let data = payments.filter((p) =>
      `${p.paymentId} ${p.userName} ${p.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    data.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [payments, search, sortField, sortOrder]);

  const totalPages = Math.ceil(
    filteredPayments.length / itemsPerPage
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Payments History" description="View all payments" />
      <PageBreadcrumb pageTitle="Payments History" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Payments History
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track all user payments and statuses
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
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
                <th
                  onClick={() => handleSort("paymentId")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Payment ID
                </th>
                <th
                  onClick={() => handleSort("userName")}
                  className="px-4 py-3 cursor-pointer"
                >
                  User Name
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Email
                </th>
                <th
                  onClick={() => handleSort("amount")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Amount
                </th>
                <th
                  onClick={() => handleSort("date")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Date
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((p, index) => (
                  <tr
                    key={p.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">{p.paymentId}</td>

                    <td className="px-4 py-4">{p.userName}</td>

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {p.email}
                    </td>

                    <td className="px-4 py-4">
                      ${p.amount.toFixed(2)}
                    </td>

                    <td className="px-4 py-4">{p.date}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          p.status === "Completed"
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
                        onClick={() =>
                          navigate(`/payments/view/${p.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-gray-400"
                  >
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-6 gap-2 flex-wrap">
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
        )}
      </div>
    </div>
  );
}
