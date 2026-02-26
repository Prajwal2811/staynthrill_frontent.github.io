import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiSearch, FiDownload } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Invoice {
  id: number;
  invoiceId: string;
  userName: string;
  userEmail: string;
  bookingFor: string; // Hotel or Adventure Name
  amount: number;
  date: string;
}

export default function FinanceInvoice() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Invoice>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  // Mock invoices (normally generated at booking checkout)
  const [invoices] = useState<Invoice[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      invoiceId: `INV${1000 + i}`,
      userName: `User ${i + 1}`,
      userEmail: `user${i + 1}@gmail.com`,
      bookingFor: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill Co.",
      amount: Math.floor(Math.random() * 5000) + 100,
      date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
    }))
  );

  // Sorting handler
  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else setSortField(field);
  };

  // Filter + Search + Sort
  const filteredInvoices = useMemo(() => {
    let data = invoices.filter((inv) =>
      `${inv.invoiceId} ${inv.userName} ${inv.userEmail} ${inv.bookingFor}`
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
  }, [invoices, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownload = (invoice: Invoice) => {
    alert(`Downloading invoice ${invoice.invoiceId} for ${invoice.userName}`);
  };

  return (
    <div>
      <PageMeta title="Finance Invoices" description="All invoices generated at booking checkout" />
      <PageBreadcrumb pageTitle="Finance Invoices" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Finance Invoices</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All invoices are automatically generated at booking checkout
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700 text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">#</th>
                <th onClick={() => handleSort("invoiceId")} className="px-4 py-3 cursor-pointer">Invoice ID</th>
                <th onClick={() => handleSort("userName")} className="px-4 py-3 cursor-pointer">User Name</th>
                <th onClick={() => handleSort("userEmail")} className="px-4 py-3 cursor-pointer">Email</th>
                <th onClick={() => handleSort("bookingFor")} className="px-4 py-3 cursor-pointer">Booking For</th>
                <th onClick={() => handleSort("amount")} className="px-4 py-3 cursor-pointer">Amount</th>
                <th onClick={() => handleSort("date")} className="px-4 py-3 cursor-pointer">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((inv, index) => (
                  <tr key={inv.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-4 font-medium">{inv.invoiceId}</td>
                    <td className="px-4 py-4">{inv.userName}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{inv.userEmail}</td>
                    <td className="px-4 py-4">{inv.bookingFor}</td>
                    <td className="px-4 py-4">${inv.amount.toFixed(2)}</td>
                    <td className="px-4 py-4">{inv.date}</td>
                    <td className="px-4 py-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/finance/invoices/view/${inv.id}`)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownload(inv)}
                        className="text-green-600 hover:text-green-800 transition"
                      >
                        <FiDownload size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No invoices found
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
