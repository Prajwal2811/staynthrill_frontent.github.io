import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Admin {
  id: number;
  adminId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: boolean;
}

const roles = ["operations_admin", "financial_admin", "support_admin"];

export default function ManageAdmin() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Admin>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [admins, setAdmins] = useState<Admin[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      adminId: `ADM${1001 + index}`,
      firstName: `Admin${index + 1}`,
      lastName: "User",
      email: `admin${index + 1}@gmail.com`,
      role: roles[index % 3],
      status: index % 2 === 0,
    }))
  );

  const toggleStatus = (id: number) => {
    setAdmins((prev) =>
      prev.map((admin) => {
        if (admin.id === id) {
          const updatedStatus = !admin.status;

          if (updatedStatus) {
            toast.success(`Admin ${admin.adminId} activated`);
          } else {
            toast.error(`Admin ${admin.adminId} deactivated`);
          }

          return { ...admin, status: updatedStatus };
        }
        return admin;
      })
    );
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setAdmins((prev) => prev.filter((admin) => admin.id !== deleteId));
      toast.error("Admin deleted successfully");
      setDeleteId(null);
    }
  };

  const handleSort = (field: keyof Admin) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAdmins = useMemo(() => {
    let data = admins.filter((admin) =>
      `${admin.firstName} ${admin.email} ${admin.adminId}`
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
  }, [admins, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Admin List" description="Manage Admin Users" />
      <PageBreadcrumb pageTitle="Admin Management" />

      {/* ✅ ALERT STYLE TOASTER */}
      <Toaster position="top-right">
        {(t) => (
          <div
            className={`${
              t.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            } border-l-4 p-4 rounded-xl shadow-lg w-96 transition-all duration-300`}
          >
            <div className="flex justify-between items-start">
              <div className="text-sm font-semibold">
                {t.message as string}
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-4 text-lg font-bold hover:opacity-70"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </Toaster>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Admin Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage system administrators
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search admin..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">#</th>
                <th onClick={() => handleSort("adminId")} className="px-4 py-3 cursor-pointer">Admin ID</th>
                <th onClick={() => handleSort("firstName")} className="px-4 py-3 cursor-pointer">Name</th>
                <th onClick={() => handleSort("email")} className="px-4 py-3 cursor-pointer">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAdmins.length > 0 ? (
                paginatedAdmins.map((admin, index) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-4 font-medium">{admin.adminId}</td>
                    <td className="px-4 py-4">
                      {admin.firstName} {admin.lastName}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {admin.email}
                    </td>
                    <td className="px-4 py-4 capitalize">
                      {admin.role.replace("_", " ")}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(admin.id)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          admin.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => navigate(`/admin/edit/${admin.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(admin.id)}
                          className="text-red-600 hover:text-red-800"
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
                    No admins found
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
                  : "border hover:bg-gray-100"
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
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Delete Admin
            </h3>
            <p className="text-sm text-gray-600 mb-6">
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
