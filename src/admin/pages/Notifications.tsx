import { useState, useMemo } from "react";
import { FiTrash2, FiSearch } from "react-icons/fi"; // ✅ removed FiEye
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

interface Notification {
  id: number;
  notificationId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  date: string;
}

export default function Notifications() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewNotification, setViewNotification] =
    useState<Notification | null>(null);

  const itemsPerPage = 10;

  const [notifications, setNotifications] = useState<Notification[]>(
    Array.from({ length: 35 }, (_, index) => ({
      id: index + 1,
      notificationId: `NOT${1001 + index}`,
      title: `Notification ${index + 1}`,
      message: `This is notification message number ${index + 1}. This contains detailed information about the notification.`,
      type:
        index % 3 === 0
          ? "info"
          : index % 3 === 1
          ? "warning"
          : "success",
      date: new Date().toLocaleDateString(),
    }))
  );

  const confirmDelete = () => {
    if (deleteId !== null) {
      setNotifications((prev) =>
        prev.filter((item) => item.id !== deleteId)
      );
      toast.error("Notification deleted");
      setDeleteId(null);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) =>
      `${item.title} ${item.notificationId} ${item.message}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [notifications, search]);

  const totalPages = Math.ceil(
    filteredNotifications.length / itemsPerPage
  );

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Notifications" description="Manage Notifications" />
      <PageBreadcrumb pageTitle="Notifications" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Notifications
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage system notifications
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search notification..."
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
                <th className="px-4 py-3">Notification ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => setViewNotification(item)}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {item.notificationId}
                    </td>

                    <td className="px-4 py-4">{item.title}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full capitalize ${
                          item.type === "info"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : item.type === "warning"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="px-4 py-4">{item.date}</td>

                    <td
                      className="px-4 py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No notifications found
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

      {/* View Modal */}
      {viewNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-[500px] shadow-xl">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              {viewNotification.title}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {viewNotification.notificationId} •{" "}
              {viewNotification.date}
            </p>

            <div className="mb-6 text-gray-700 dark:text-gray-300">
              {viewNotification.message}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewNotification(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Delete Notification
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
