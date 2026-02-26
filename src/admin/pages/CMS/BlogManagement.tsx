import { useState, useMemo } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface Blog {
  id: number;
  title: string;
  slug: string;
  image: string;
  shortDescription: string;
  status: "Published" | "Draft";
  createdAt: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([
  {
    id: 1,
    title: "Welcome to Our Platform",
    slug: "welcome-to-our-platform",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Introduction to our new digital platform.",
    status: "Published",
    createdAt: "2026-02-01",
  },
  {
    id: 2,
    title: "How to Grow Your Business Online",
    slug: "how-to-grow-your-business-online",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Tips and strategies for online growth.",
    status: "Published",
    createdAt: "2026-02-03",
  },
  {
    id: 3,
    title: "Top 10 Marketing Strategies",
    slug: "top-10-marketing-strategies",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Effective marketing techniques for 2026.",
    status: "Draft",
    createdAt: "2026-02-05",
  },
  {
    id: 4,
    title: "Understanding SEO Basics",
    slug: "understanding-seo-basics",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Beginner’s guide to SEO optimization.",
    status: "Published",
    createdAt: "2026-02-07",
  },
  {
    id: 5,
    title: "Social Media Trends 2026",
    slug: "social-media-trends-2026",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Latest trends in social media marketing.",
    status: "Draft",
    createdAt: "2026-02-08",
  },
  {
    id: 6,
    title: "Building a Strong Brand Identity",
    slug: "building-a-strong-brand-identity",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "How to create a memorable brand.",
    status: "Published",
    createdAt: "2026-02-09",
  },
  {
    id: 7,
    title: "Email Marketing Guide",
    slug: "email-marketing-guide",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Complete email marketing tutorial.",
    status: "Published",
    createdAt: "2026-02-10",
  },
  {
    id: 8,
    title: "Content Creation Tips",
    slug: "content-creation-tips",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Improve your content strategy today.",
    status: "Draft",
    createdAt: "2026-02-11",
  },
  {
    id: 9,
    title: "Why UI/UX Matters",
    slug: "why-ui-ux-matters",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Importance of user experience design.",
    status: "Published",
    createdAt: "2026-02-12",
  },
  {
    id: 10,
    title: "Future of Artificial Intelligence",
    slug: "future-of-artificial-intelligence",
    image: "https://via.placeholder.com/300x200",
    shortDescription: "Exploring AI innovations and trends.",
    status: "Draft",
    createdAt: "2026-02-13",
  },
]);


  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image: "",
    shortDescription: "",
    status: "Draft" as "Published" | "Draft",
  });

  /* ---------------- Slug Generator ---------------- */
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  /* ---------------- Filter ---------------- */
  const filteredBlogs = useMemo(() => {
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, blogs]);

  /* ---------------- Modal ---------------- */
  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData(blog);
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        slug: "",
        image: "",
        shortDescription: "",
        status: "Draft",
      });
    }
    setIsModalOpen(true);
  };

  /* ---------------- Save ---------------- */
  const handleSave = () => {
    if (!formData.title || !formData.image) {
      toast.error("Title and Image are required");
      return;
    }

    if (editingBlog) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === editingBlog.id ? { ...b, ...formData } : b
        )
      );
      toast.success("Blog updated successfully");
    } else {
      const newBlog: Blog = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBlogs([newBlog, ...blogs]);
      toast.success("Blog added successfully");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
    toast.success("Blog deleted successfully");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  return (
    <>
      <PageMeta title="Blog Management | CMS" />
      <PageBreadcrumb pageTitle="Blog Management" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Blog Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage blog articles
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative w-72">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FiPlus size={16} />
              Add Blog
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4">
                      <img
                        src={blog.image}
                        alt="blog"
                        className="w-24 h-14 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-4 font-medium">{blog.title}</td>
                    <td className="px-4 py-4 text-gray-500">{blog.slug}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          blog.status === "Published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {blog.createdAt}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <FiEdit
                          className="cursor-pointer text-blue-600"
                          onClick={() => handleOpenModal(blog)}
                        />
                        <FiTrash2
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDelete(blog.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-[500px] shadow-xl">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {editingBlog ? "Edit Blog" : "Add Blog"}
            </h3>

            <input
              type="text"
              placeholder="Blog Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: generateSlug(e.target.value),
                })
              }
              className="w-full border rounded-lg px-4 py-2 mb-3"
            />

            <input
              type="text"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mb-3"
            />

            <textarea
              placeholder="Short Description"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shortDescription: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-2 mb-3"
            />

            {/* Modern Image Upload */}
            {!formData.image ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer mb-4">
                <p className="text-sm text-gray-500">
                  Click to upload blog image
                </p>
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
                  onClick={() =>
                    setFormData({ ...formData, image: "" })
                  }
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "Published" | "Draft",
                })
              }
              className="w-full border rounded-lg px-4 py-2 mb-4"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
