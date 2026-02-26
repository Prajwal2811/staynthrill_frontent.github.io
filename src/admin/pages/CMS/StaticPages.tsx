import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Page {
  id: number;
  title: string;
  slug: string;
  status: boolean;
}

export default function StaticPages() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Page>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const [pages, setPages] = useState<Page[]>([
    { id: 1, title: "Home", slug: "home", status: true },
    { id: 2, title: "About Us", slug: "about-us", status: true },
    { id: 3, title: "Contact Us", slug: "contact-us", status: true },
    { id: 4, title: "Privacy Policy", slug: "privacy-policy", status: true },
    { id: 5, title: "Refund Policy", slug: "refund-policy", status: true },
  ]);

  const handleSort = (field: keyof Page) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleStatus = (id: number) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, status: !page.status } : page
      )
    );
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setPages((prev) => prev.filter((page) => page.id !== deleteId));
      toast.success("Page deleted successfully");
      setDeleteId(null);
    }
  };

  const filteredPages = useMemo(() => {
    let data = pages.filter((page) =>
      `${page.title} ${page.slug}`
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
  }, [pages, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);

  const paginatedPages = filteredPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Static Pages" description="Manage CMS Pages" />
      <PageBreadcrumb pageTitle="Static Pages Management" />
      <Toaster position="top-right" />

      <div className="max-w-8xl mx-auto mt-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-semibold dark:text-white">
                Static Pages
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Manage your website static pages.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-64">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500 uppercase text-xs dark:text-gray-400">
                  <th className="px-4 py-3 text-left">#</th>
                  <th
                    onClick={() => handleSort("title")}
                    className="px-4 py-3 text-left cursor-pointer"
                  >
                    Title
                  </th>
                  <th
                    onClick={() => handleSort("slug")}
                    className="px-4 py-3 text-left cursor-pointer"
                  >
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedPages.map((page, index) => (
                  <tr
                    key={page.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {page.title}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      {page.slug}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(page.id)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          page.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {page.status ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            navigate(`/cms/pages/edit/${page.slug}`, {
                              state: page,
                            })
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(page.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedPages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No pages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Delete Page
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to delete this page?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
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
