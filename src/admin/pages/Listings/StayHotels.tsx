import { useState, useMemo } from "react";
import { FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Hotel {
  id: number;
  hotelId: string;
  name: string;
  location: string;
  category: string;
  userName: string;
  email: string;
}

export default function StayHotels() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Hotel>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [hotels] = useState<Hotel[]>(
    Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      hotelId: `HTL${3001 + index}`,
      name: `Stay Hotel ${index + 1}`,
      location: ["Mumbai", "Goa", "Delhi", "Jaipur"][index % 4],
      category: "Stay",
      userName: `User ${index + 1}`,
      email: `user${index + 1}@gmail.com`,
    }))
  );

  const handleSort = (field: keyof Hotel) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredHotels = useMemo(() => {
    let data = hotels.filter((hotel) =>
      `${hotel.name} ${hotel.location} ${hotel.hotelId} ${hotel.userName} ${hotel.email}`
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
  }, [hotels, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Stay Hotels" description="List of Stay Category Hotels" />
      <PageBreadcrumb pageTitle="Stay Hotels" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Stay Hotels
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hotels under Stay category
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search stay hotel..."
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
                  onClick={() => handleSort("hotelId")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Hotel ID
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="px-4 py-3 cursor-pointer"
                >
                  Hotel Name
                </th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">User Details</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedHotels.length > 0 ? (
                paginatedHotels.map((hotel, index) => (
                  <tr
                    key={hotel.id}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {hotel.hotelId}
                    </td>
                    <td className="px-4 py-4">{hotel.name}</td>
                    <td className="px-4 py-4">{hotel.location}</td>

                    <td className="px-4 py-4">
                      <div className="font-medium">{hotel.userName}</div>
                      <div className="text-xs text-gray-500">
                        {hotel.email}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FiEye size={18} />
                        </button>

                        <button className="text-red-600 hover:text-red-800">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No Stay hotels found
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
    </div>
  );
}
