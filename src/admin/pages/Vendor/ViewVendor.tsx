import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
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
  status: "pending" | "approved" | "rejected";
}

export default function ViewVendor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    setVendor({
      id: Number(id),
      vendorId: `VEN${1000 + Number(id)}`,
      firstName: `Vendor${id}`,
      lastName: "User",
      email: `vendor${id}@gmail.com`,
      role: "hotel_vendor",
      status: "pending",
    });
  }, [id]);

  if (!vendor) return <div className="p-6">Loading...</div>;

  const handleAction = (type: "approved" | "rejected") => {
    setVendor({ ...vendor, status: type });
    setShowModal(false);
    toast.success(
      type === "approved"
        ? "Vendor Approved Successfully"
        : "Vendor Rejected"
    );
  };

  const getStatusColor = () => {
    switch (vendor.status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  return (
    <div>
      <PageMeta title="Vendor Details" description="View Vendor Details" />
      <PageBreadcrumb pageTitle="Vendor Details" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Top Section */}
        <div className="mb-6">
        
        {/* First Row */}
        <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold dark:text-white">
                        Vendor Details
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        View complete information and application status of the selected vendor.
                    </p>
                </div>


            <div className="flex items-center gap-3">
            <span
                className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${getStatusColor()}`}
            >
                {vendor.status}
            </span>

            {vendor.status === "pending" && (
                <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                Review Vendor
                </button>
            )}
            </div>
        </div>

        {/* Second Row - Back Button */}
        <div className="mt-4">
            <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
            <FiArrowLeft />
            Back
            </button>
        </div>

        </div>


        {/* Vendor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Vendor ID</p>
            <p className="font-medium">{vendor.vendorId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">
              {vendor.firstName} {vendor.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{vendor.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">
              {vendor.role.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 shadow-xl">

            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Review Vendor Application
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Add optional remark before taking action.
            </p>

            <textarea
              placeholder="Enter remark (optional)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 dark:bg-gray-800"
            />

            <div className="flex justify-between gap-3">

              <button
                onClick={() => handleAction("approved")}
                className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Approve
              </button>

              <button
                onClick={() => handleAction("rejected")}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Reject
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-3 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
