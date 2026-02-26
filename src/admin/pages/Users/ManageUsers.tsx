import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}

export default function ManageUsers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof User>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [users, setUsers] = useState<User[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      userId: `USR${1001 + index}`,
      firstName: `User${index + 1}`,
      lastName: "Member",
      email: `user${index + 1}@gmail.com`,
      status: index % 2 === 0,
    }))
  );

  // Toggle Status
  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const updatedStatus = !user.status;

          toast.success(
            `User ${user.userId} ${
              updatedStatus ? "activated" : "deactivated"
            }`
          );

          return { ...user, status: updatedStatus };
        }
        return user;
      })
    );
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (deleteId !== null) {
      setUsers((prev) => prev.filter((user) => user.id !== deleteId));
      toast.error("User deleted successfully");
      setDeleteId(null);
    }
  };

  // Sorting
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filtering + Sorting
  const filteredUsers = useMemo(() => {
    let data = users.filter((user) =>
      `${user.firstName} ${user.email} ${user.userId}`
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
  }, [users, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="User List" description="Manage Platform Users" />
      <PageBreadcrumb pageTitle="User Management" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              User Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage platform users and account status
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
                  onClick={() => handleSort("userId")}
                  className="px-4 py-3 cursor-pointer"
                >
                  User ID
                </th>
                <th
                  onClick={() => handleSort("firstName")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Email
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {user.userId}
                    </td>

                    <td className="px-4 py-4">
                      {user.firstName} {user.lastName}
                    </td>

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`px-3 py-1 text-xs rounded-full transition ${
                          user.status
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {user.status ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => navigate(`/users/${user.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(user.id)}
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
                    No users found
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
              Delete User
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
