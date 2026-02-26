import { useState, useMemo } from "react";
import { FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Hotel {
  id: number;
  hotelId: string;
  vendorId: string;
  name: string;
  location: string;
  category: string;
  price: number;
  status: boolean;
}

const categories = ["Stay", "Resort", "Apartment"];

export default function ApprovedHotels() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewHotel, setViewHotel] = useState<Hotel | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Hotel>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [hotels, setHotels] = useState<Hotel[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      hotelId: `HTL${1001 + index}`,
      vendorId: `VND${501 + index}`,
      name: `Hotel ${index + 1}`,
      location: ["Mumbai", "Goa", "Delhi", "Jaipur"][index % 4],
      category: categories[index % 3],
      price: 2500 + index * 200,
      status: index % 2 === 0,
    }))
  );

  const approvedHotels = hotels.filter((hotel) => hotel.status === true);

  const confirmDelete = () => {
    if (deleteId !== null) {
      setHotels((prev) => prev.filter((hotel) => hotel.id !== deleteId));
      toast.error("Hotel deleted successfully");
      setDeleteId(null);
    }
  };

  const handleSort = (field: keyof Hotel) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredHotels = useMemo(() => {
    let data = approvedHotels.filter((hotel) =>
      `${hotel.name} ${hotel.location} ${hotel.hotelId} ${hotel.vendorId}`
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
  }, [approvedHotels, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Approved Hotels" description="Admin Approved Hotel Listings" />
      <PageBreadcrumb pageTitle="Approved Hotels" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Approved Hotels by Admin
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hotels approved and visible on platform
            </p>
          </div>

          <div className="relative w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search hotel..."
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
                <th onClick={() => handleSort("hotelId")} className="px-4 py-3 cursor-pointer">Hotel ID</th>
                <th>Vendor ID</th>
                <th onClick={() => handleSort("name")} className="px-4 py-3 cursor-pointer">Hotel Name</th>
                <th>Location</th>
                <th>Category</th>
                <th onClick={() => handleSort("price")} className="px-4 py-3 cursor-pointer">Price/Night</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedHotels.map((hotel, index) => (
                <tr
                  key={hotel.id}
                  className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-4">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  <td className="px-4 py-4 font-medium">{hotel.hotelId}</td>
                  <td className="px-4 py-4">{hotel.vendorId}</td>
                  <td className="px-4 py-4">{hotel.name}</td>
                  <td className="px-4 py-4">{hotel.location}</td>

                  <td className="px-4 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      {hotel.category}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-semibold text-blue-600">
                    ₹{hotel.price}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setViewHotel(hotel)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEye size={18} />
                      </button>

                      <button
                        onClick={() => setDeleteId(hotel.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      {viewHotel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-[500px] shadow-xl">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Hotel Details
            </h3>

            <div className="space-y-3 text-sm">
              <p><strong>Hotel ID:</strong> {viewHotel.hotelId}</p>
              <p><strong>Vendor ID:</strong> {viewHotel.vendorId}</p>
              <p><strong>Name:</strong> {viewHotel.name}</p>
              <p><strong>Location:</strong> {viewHotel.location}</p>
              <p><strong>Category:</strong> {viewHotel.category}</p>
              <p><strong>Price:</strong> ₹{viewHotel.price}</p>
              <p><strong>Status:</strong> Approved</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewHotel(null)}
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
              Delete Hotel
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
