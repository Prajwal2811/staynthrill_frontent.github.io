import { useState, useMemo } from "react";
import { FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Adventure {
  id: number;
  adventureId: string;
  title: string;
  vendorName: string;
  category: string;
  price: number;
  status: boolean;
}

const categories = ["Trekking", "Water Sports", "Camping", "Safari"];

export default function VendorAdventures() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewAdventure, setViewAdventure] = useState<Adventure | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Adventure>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [adventures, setAdventures] = useState<Adventure[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      adventureId: `ADV${2001 + index}`,
      title: `Adventure ${index + 1}`,
      vendorName: `Vendor ${index % 10 + 1}`,
      category: categories[index % 4],
      price: 1500 + index * 100,
      status: index % 2 === 0,
    }))
  );

  const toggleStatus = (id: number) => {
    setAdventures((prev) =>
      prev.map((adventure) => {
        if (adventure.id === id) {
          const updatedStatus = !adventure.status;
          toast.success(
            `Adventure ${adventure.adventureId} ${
              updatedStatus ? "approved" : "rejected"
            }`
          );
          return { ...adventure, status: updatedStatus };
        }
        return adventure;
      })
    );
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setAdventures((prev) =>
        prev.filter((adventure) => adventure.id !== deleteId)
      );
      toast.error("Adventure deleted successfully");
      setDeleteId(null);
    }
  };

  const handleSort = (field: keyof Adventure) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAdventures = useMemo(() => {
    let data = adventures.filter((adventure) =>
      `${adventure.title} ${adventure.vendorName} ${adventure.adventureId}`
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
  }, [adventures, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAdventures.length / itemsPerPage);

  const paginatedAdventures = filteredAdventures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Vendor Adventures" description="Adventures added by vendors" />
      <PageBreadcrumb pageTitle="Vendor Adventures" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Adventures Added by Vendors
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage vendor-submitted adventures
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search adventure..."
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
                <th onClick={() => handleSort("adventureId")} className="px-4 py-3 cursor-pointer">Adventure ID</th>
                <th onClick={() => handleSort("title")} className="px-4 py-3 cursor-pointer">Title</th>
                <th onClick={() => handleSort("vendorName")} className="px-4 py-3 cursor-pointer">Vendor</th>
                <th onClick={() => handleSort("price")} className="px-4 py-3 cursor-pointer">Price</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAdventures.length > 0 ? (
                paginatedAdventures.map((adventure, index) => (
                  <tr
                    key={adventure.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">{adventure.adventureId}</td>
                    <td className="px-4 py-4">{adventure.title}</td>
                    <td className="px-4 py-4">{adventure.vendorName}</td>

                    <td className="px-4 py-4 font-medium text-blue-600">
                      ₹{adventure.price}
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        {adventure.category}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(adventure.id)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          adventure.status
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {adventure.status ? "Approved" : "Pending"}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setViewAdventure(adventure)}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(adventure.id)}
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
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No adventures found
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
      {viewAdventure && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-[450px] shadow-xl">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Adventure Details
            </h3>

            <div className="space-y-3 text-sm">
              <p><strong>ID:</strong> {viewAdventure.adventureId}</p>
              <p><strong>Title:</strong> {viewAdventure.title}</p>
              <p><strong>Vendor:</strong> {viewAdventure.vendorName}</p>
              <p><strong>Category:</strong> {viewAdventure.category}</p>
              <p><strong>Price:</strong> ₹{viewAdventure.price}</p>
              <p>
                <strong>Status:</strong>{" "}
                {viewAdventure.status ? "Approved" : "Pending"}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewAdventure(null)}
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
              Delete Adventure
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
