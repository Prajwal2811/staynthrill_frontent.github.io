import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
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
  pricePerNight: number;
  status: "approved" | "rejected";
}

export default function ViewPendingHotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    setHotel({
      id: Number(id),
      hotelId: `HTL${3000 + Number(id)}`,
      vendorId: `VND${700 + Number(id)}`,
      name: `Hotel ${id}`,
      location: ["Mumbai", "Delhi", "Goa", "Jaipur"][Number(id) % 4],
      category: ["Luxury", "Budget", "Resort", "Boutique"][Number(id) % 4],
      pricePerNight: 3500 + Number(id) * 200,
      status: "approved", // ✅ default approved
    });
  }, [id]);

  if (!hotel) return <div className="p-6">Loading...</div>;

  const handleReject = () => {
    setHotel({ ...hotel, status: "rejected" });
    setShowModal(false);
    toast.success("Hotel Rejected Successfully");
  };

  const getStatusColor = () => {
    switch (hotel.status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <div>
      <PageMeta title="Hotel Details" description="View Hotel Details" />
      <PageBreadcrumb pageTitle="Hotel Details" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Top Section */}
        <div className="mb-6">

          {/* First Row */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold dark:text-white">
                Hotel Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View complete information and update approval status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${getStatusColor()}`}
              >
                {hotel.status}
              </span>

              {/* ✅ Only show Reject button if currently approved */}
              {hotel.status === "approved" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Reject Hotel
                </button>
              )}
            </div>
          </div>

          {/* Back Button */}
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

        {/* Hotel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Hotel ID</p>
            <p className="font-medium">{hotel.hotelId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Vendor ID</p>
            <p className="font-medium">{hotel.vendorId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Hotel Name</p>
            <p className="font-medium">{hotel.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{hotel.location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{hotel.category}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Price Per Night</p>
            <p className="font-medium text-blue-600">
              ₹{hotel.pricePerNight}
            </p>
          </div>

        </div>
      </div>

      {/* Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 shadow-xl">

            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Reject Hotel
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Please provide a reason for rejection (optional).
            </p>

            <textarea
              placeholder="Enter rejection reason"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 dark:bg-gray-800"
            />

            <div className="flex gap-3">

              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Reject
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
