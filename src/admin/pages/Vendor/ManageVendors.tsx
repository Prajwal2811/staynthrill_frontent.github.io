import { useState, useMemo } from "react";
import { FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Vendor {
  id: number;
  vendorId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: boolean;
}

const roles = ["hotel_vendor", "adventure_vendor", "travel_vendor"];

export default function ManageVendors() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Vendor>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [vendors, setVendors] = useState<Vendor[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      vendorId: `VEN${1001 + index}`,
      firstName: `Vendor${index + 1}`,
      lastName: "User",
      email: `vendor${index + 1}@gmail.com`,
      role: roles[index % 3],
      status: index % 2 === 0,
    }))
  );

  const toggleStatus = (id: number) => {
    setVendors((prev) =>
      prev.map((vendor) => {
        if (vendor.id === id) {
          const updatedStatus = !vendor.status;

          toast.success(
            `Vendor ${vendor.vendorId} ${
              updatedStatus ? "activated" : "deactivated"
            }`
          );

          return { ...vendor, status: updatedStatus };
        }
        return vendor;
      })
    );
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setVendors((prev) => prev.filter((v) => v.id !== deleteId));
      toast.error("Vendor deleted successfully");
      setDeleteId(null);
    }
  };

  const handleSort = (field: keyof Vendor) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredVendors = useMemo(() => {
    let data = vendors.filter((vendor) =>
      `${vendor.firstName} ${vendor.email} ${vendor.vendorId}`
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
  }, [vendors, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadge = (role: string) => {
    const base = "px-3 py-1 text-xs rounded-full capitalize font-medium";

    switch (role) {
      case "hotel_vendor":
        return `${base} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`;
      case "adventure_vendor":
        return `${base} bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300`;
      case "travel_vendor":
        return `${base} bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div>
      <PageMeta title="Vendor List" description="Manage Vendors" />
      <PageBreadcrumb pageTitle="Vendor Management" />

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
              <div className="text-sm font-semibold">{t.message as string}</div>
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
              Vendor Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage vendors and their service categories
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
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
                <th onClick={() => handleSort("vendorId")} className="px-4 py-3 cursor-pointer">
                  Vendor ID
                </th>
                <th onClick={() => handleSort("firstName")} className="px-4 py-3 cursor-pointer">
                  Name
                </th>
                <th onClick={() => handleSort("email")} className="px-4 py-3 cursor-pointer">
                  Email
                </th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedVendors.length > 0 ? (
                paginatedVendors.map((vendor, index) => (
                  <tr
                    key={vendor.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-4 font-medium">{vendor.vendorId}</td>
                    <td className="px-4 py-4">{vendor.firstName} {vendor.lastName}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{vendor.email}</td>
                    <td className="px-4 py-4">
                      <span className={getRoleBadge(vendor.role)}>
                        {vendor.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(vendor.id)}
                        className={`px-3 py-1 text-xs rounded-full transition ${
                          vendor.status
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {vendor.status ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => navigate(`/vendors/view/${vendor.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(vendor.id)}
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
                    No vendors found
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
              Delete Vendor
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
