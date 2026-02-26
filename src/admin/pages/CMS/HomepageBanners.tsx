import { useState, useMemo } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  status: boolean;
  createdAt: string;
}

export default function HomepageBanners() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% off",
      image:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190622/ourmid/pngtree-may-one-spring-travel-banner-background-image_217010.jpg",
      status: true,
      createdAt: "2026-02-01",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    status: true,
  });

  /* ---------------- CRUD ---------------- */

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      status: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      status: banner.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.image) {
      toast.error("Title and Image are required");
      return;
    }

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id ? { ...b, ...formData } : b
        )
      );
      toast.success("Banner updated successfully");
    } else {
      const newBanner: Banner = {
        id: Date.now(),
        title: formData.title,
        subtitle: formData.subtitle,
        image: formData.image,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setBanners((prev) => [newBanner, ...prev]);
      toast.success("Banner added successfully");
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setBanners((prev) => prev.filter((b) => b.id !== deleteId));
      toast.success("Banner deleted successfully");
      setDeleteId(null);
    }
  };

  const toggleStatus = (id: number) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: !b.status } : b
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  /* ---------------- Filter + Pagination ---------------- */

  const filteredBanners = useMemo(() => {
    return banners.filter((banner) =>
      banner.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [banners, search]);

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Homepage Banners" description="Manage Homepage Banners" />
      <PageBreadcrumb pageTitle="Homepage Banners" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        {/* Header */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Homepage Banners
            </h2>
            <p className="text-sm text-gray-500">
              Manage homepage promotional banners
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search banner..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 rounded-lg border"
              />
            </div>

            <button
              onClick={openAddModal}
              type="button"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <FiPlus size={16} />
              Add Banner
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm border">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Subtitle</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBanners.map((banner, index) => (
              <tr key={banner.id} className="border-b">
                <td className="px-4 py-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                <td className="px-4 py-4">
                  <img
                    src={banner.image}
                    className="w-24 h-14 object-cover rounded"
                  />
                </td>

                <td className="px-4 py-4 font-medium">{banner.title}</td>
                <td className="px-4 py-4">{banner.subtitle}</td>

                <td className="px-4 py-4">
                  <button
                    onClick={() => toggleStatus(banner.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      banner.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {banner.status ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center gap-4">
                    <FiEdit
                      className="cursor-pointer text-blue-600"
                      onClick={() => openEditModal(banner)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() => setDeleteId(banner.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingBanner ? "Edit Banner" : "Add Banner"}
            </h3>

            <input
              type="text"
              placeholder="Banner Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full border rounded-lg px-4 py-2 mb-3"
            />

            <input
              type="text"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              className="w-full border rounded-lg px-4 py-2 mb-3"
            />

            {!formData.image ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer mb-4">
                <p className="text-sm text-gray-500">Click to upload image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative mb-4">
                <img
                  src={formData.image}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: "" }))
                  }
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Delete Banner</h3>
            <p className="text-sm mb-6">Are you sure?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
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
