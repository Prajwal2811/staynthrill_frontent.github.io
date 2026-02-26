import { useState, useMemo } from "react";
import { FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // <- added for navigation
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Booking {
  id: number;
  bookingId: string;
  customerName: string;
  email: string;
  serviceType: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
}

const services = ["Hotel Stay", "Adventure Trip", "Tour Package"];

export default function CompletedBookings() {
  const navigate = useNavigate(); // <- initialize navigate

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Booking>("bookingDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;
  const today = new Date().toISOString().split("T")[0];

  const [bookings, setBookings] = useState<Booking[]>(
    Array.from({ length: 60 }, (_, index) => ({
      id: index + 1,
      bookingId: `BK${4001 + index}`,
      customerName: `Customer ${index + 1}`,
      email: `customer${index + 1}@gmail.com`,
      serviceType: services[index % 3],
      bookingDate:
        index % 2 === 0
          ? `2025-12-${(index % 28) + 1}` // Past dates
          : `2026-03-${(index % 28) + 1}`, // Future dates
      status:
        index % 3 === 0
          ? "confirmed"
          : index % 3 === 1
          ? "pending"
          : "cancelled",
    }))
  );

  const confirmDelete = () => {
    if (deleteId !== null) {
      setBookings((prev) => prev.filter((b) => b.id !== deleteId));
      toast.error("Booking deleted successfully");
      setDeleteId(null);
    }
  };

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredBookings = useMemo(() => {
    let data = bookings.filter(
      (booking) =>
        booking.status === "confirmed" &&
        booking.bookingDate < today &&
        `${booking.customerName} ${booking.email} ${booking.bookingId}`
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
  }, [bookings, search, sortField, sortOrder, today]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta
        title="Completed Bookings"
        description="Manage Completed Bookings"
      />
      <PageBreadcrumb pageTitle="Completed Bookings" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Completed Bookings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View all completed bookings
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search completed booking..."
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
                <th onClick={() => handleSort("bookingId")} className="px-4 py-3 cursor-pointer">Booking ID</th>
                <th onClick={() => handleSort("customerName")} className="px-4 py-3 cursor-pointer">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th onClick={() => handleSort("bookingDate")} className="px-4 py-3 cursor-pointer">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">{booking.bookingId}</td>

                    <td className="px-4 py-4">{booking.customerName}</td>

                    <td className="px-4 py-4">{booking.serviceType}</td>

                    <td className="px-4 py-4">{booking.bookingDate}</td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        {/* Navigate to ViewBooking page */}
                        <button
                          onClick={() => navigate(`/bookings/view/${booking.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(booking.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No completed bookings found
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

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Delete Booking
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
