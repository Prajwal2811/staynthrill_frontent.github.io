import { useState, useMemo } from "react";
import { FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Review {
  id: number;
  userName: string;
  email: string;
  title: string;
  message: string;
  rating: number;
  status: boolean;
}

export default function UsersReviews() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Review>("userName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [reviews, setReviews] = useState<Review[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      userName: `User ${index + 1}`,
      email: `user${index + 1}@gmail.com`,
      title: `Great Service ${index + 1}`,
      message: "Amazing experience. Highly recommended!",
      rating: (index % 5) + 1,
      status: index % 2 === 0,
    }))
  );

  /* ================= STATUS TOGGLE ================= */

  const toggleStatus = (id: number) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === id) {
          const updated = !review.status;
          toast.success(
            `Review ${
              updated ? "approved" : "marked as pending"
            }`
          );
          return { ...review, status: updated };
        }
        return review;
      })
    );
  };

  /* ================= DELETE ================= */

  const confirmDelete = () => {
    if (deleteId !== null) {
      setReviews((prev) =>
        prev.filter((review) => review.id !== deleteId)
      );
      toast.error("Review deleted successfully");
      setDeleteId(null);
    }
  };

  /* ================= SORT ================= */

  const handleSort = (field: keyof Review) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  /* ================= FILTER + SORT ================= */

  const filteredReviews = useMemo(() => {
    let data = reviews.filter((review) =>
      `${review.userName} ${review.email} ${review.title}`
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
  }, [reviews, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="User Reviews" description="Manage User Reviews" />
      <PageBreadcrumb pageTitle="User Reviews" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              User Reviews Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and approve user-submitted reviews
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-700 text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">#</th>
                <th onClick={() => handleSort("userName")} className="px-4 py-3 cursor-pointer">
                  User Name
                </th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Title</th>
                <th onClick={() => handleSort("rating")} className="px-4 py-3 cursor-pointer">
                  Rating
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedReviews.length > 0 ? (
                paginatedReviews.map((review, index) => (
                  <tr
                    key={review.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {review.userName}
                    </td>

                    <td className="px-4 py-4">{review.email}</td>

                    <td className="px-4 py-4">{review.title}</td>

                    <td className="px-4 py-4 text-yellow-500">
                      {"⭐".repeat(review.rating)}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(review.id)}
                        className={`px-3 py-1 text-xs rounded-full transition ${
                          review.status
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {review.status ? "Approved" : "Pending"}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            navigate(`/admin/reviews/${review.id}`)
                          }
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(review.id)}
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
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION (LIKE ManageUsers) ================= */}
        {totalPages > 1 && (
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
        )}
      </div>

      {/* ================= DELETE MODAL ================= */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Delete Review
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