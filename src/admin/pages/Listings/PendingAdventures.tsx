import { useState, useMemo } from "react";
import { FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Adventure {
  id: number;
  adventureId: string;
  vendorId: string;
  title: string;
  location: string;
  category: string;
  price: number;
}

const categories = ["Trekking", "Safari", "Water Sports"];

export default function PendingAdventures() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Adventure>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [adventures, setAdventures] = useState<Adventure[]>(
    Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      adventureId: `ADV${2001 + index}`,
      vendorId: `VND${601 + index}`,
      title: `Adventure ${index + 1}`,
      location: ["Manali", "Rishikesh", "Goa", "Ladakh"][index % 4],
      category: categories[index % 3],
      price: 1500 + index * 200,
    }))
  );

  const confirmDelete = () => {
    if (deleteId !== null) {
      setAdventures((prev) =>
        prev.filter((adv) => adv.id !== deleteId)
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
    let data = adventures.filter((adv) =>
      `${adv.title} ${adv.location} ${adv.adventureId} ${adv.vendorId}`
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
      <PageMeta title="Pending Adventures" description="Manage Pending Adventures" />
      <PageBreadcrumb pageTitle="Pending Adventure Management" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Pending Adventures</h2>
            <p className="text-sm text-gray-500">
              Review vendor adventure listings
            </p>
          </div>

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
                <th onClick={() => handleSort("adventureId")} className="px-4 py-3 cursor-pointer">Adventure ID</th>
                <th className="px-4 py-3">Vendor ID</th>
                <th onClick={() => handleSort("title")} className="px-4 py-3 cursor-pointer">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Category</th>
                <th onClick={() => handleSort("price")} className="px-4 py-3 cursor-pointer">Price</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAdventures.length > 0 ? (
                paginatedAdventures.map((adv, index) => (
                  <tr key={adv.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-4 font-medium">{adv.adventureId}</td>
                    <td className="px-4 py-4">{adv.vendorId}</td>
                    <td className="px-4 py-4">{adv.title}</td>
                    <td className="px-4 py-4">{adv.location}</td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                        {adv.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-blue-600">
                      ₹{adv.price}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            navigate(`/adventures/pending/view/${adv.id}`)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(adv.id)}
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
                  : "border hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Delete Modal */}
        {deleteId !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">
                Delete Adventure
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
    </div>
  );
}
