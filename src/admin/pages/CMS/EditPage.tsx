import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function EditPage() {
  const { slug } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    subHeading: "",
    shortDescription: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    status: true,
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // 🔥 Simulate fetching page data by slug
  useEffect(() => {
    const existingPage = {
      title: "Home",
      heading: "Welcome to Our Website",
      subHeading: "We provide the best services",
      shortDescription: "This is a short intro section.",
      content: "Full page content goes here...",
      metaTitle: "Home - My Website",
      metaDescription: "Best website for amazing services.",
      status: true,
    };

    setFormData(existingPage);
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    let newErrors: any = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.heading) newErrors.heading = "Heading is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    console.log("Updated Page:", { slug, ...formData });

    setTimeout(() => {
      alert("Page Updated Successfully!");
      setLoading(false);
      setErrors({});
    }, 1000);
  };

  return (
    <div>
      <PageMeta title="Edit Page" description="Update CMS Page" />
      <PageBreadcrumb pageTitle="Edit Page" />

      <div className="max-w-8xl mx-auto mt-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">
            Edit Page
          </h2>
          <p className="text-gray-500 text-sm mb-6 dark:text-gray-400">
            Update the content and SEO details for this page.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Page Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  disabled
                  className="w-full rounded-lg border px-4 py-2 bg-gray-100 dark:bg-gray-700"
                />
              </div>

              {/* Heading */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Main Heading *
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
                {errors.heading && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.heading}
                  </p>
                )}
              </div>

              {/* Sub Heading */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Sub Heading
                </label>
                <input
                  type="text"
                  name="subHeading"
                  value={formData.subHeading}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>

              {/* Full Content */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">
                  Full Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>

              {/* Meta Title */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>

              {/* Meta Description */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">
                  Active Page
                </label>
              </div>

            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Updating..." : "Update Page"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
