import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ViewReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Replace with real API call later
  const review = {
    id,
    userName: `User ${id}`,
    email: `user${id}@gmail.com`,
    title: `Great Service ${id}`,
    message:
      "Amazing experience. Highly recommended! Everything was smooth and professional.",
    rating: 5,
    status: true,
  };

  return (
    <div>
      <PageMeta title="View Review" description="Review Details Page" />
      <PageBreadcrumb pageTitle="View Review" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiArrowLeft />
          Back to Reviews
        </button>

        {/* Page Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold dark:text-white">
            Review Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View complete information of selected review
          </p>
        </div>

        {/* Review Details Card */}
        <div className="grid md:grid-cols-2 gap-8 text-sm">
          
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">User Name</p>
              <p className="font-medium dark:text-white">
                {review.userName}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium dark:text-white">
                {review.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Title</p>
              <p className="font-medium dark:text-white">
                {review.title}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Rating</p>
              <p className="text-yellow-500 text-base">
                {"⭐".repeat(review.rating)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              {review.status ? (
                <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Approved
                </span>
              ) : (
                <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  Pending
                </span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <p className="text-gray-500 mb-2">Review Message</p>
            <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.message}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
